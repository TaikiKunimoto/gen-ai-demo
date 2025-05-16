import pandas as pd
import numpy as np
from scipy import stats
import requests
from io import StringIO
import os
from typing import Dict, Any

class DataProcessor:
    def __init__(self, data_url=None):
        """
        データ処理クラスの初期化
        Args:
            data_url: データソースのURL
        """
        # デフォルトのデータソースURL（World Happiness Report 2021）
        self.data_url = data_url or "https://raw.githubusercontent.com/datahub-project/datahub/main/metadata-ingestion/examples/data_examples/kaggle/world-happiness-report-2021.csv"
        self.raw_data = None
        self.processed_data = None
    
    def fetch_data(self) -> pd.DataFrame:
        """
        URLからデータを取得する
        Returns:
            DataFrame: 読み込んだデータ
        """
        try:
            response = requests.get(self.data_url)
            response.raise_for_status()  # エラーチェック
            
            # CSVかJSONかを判断してデータを読み込む
            if self.data_url.endswith('.csv'):
                self.raw_data = pd.read_csv(StringIO(response.text))
            elif self.data_url.endswith('.json'):
                self.raw_data = pd.read_json(StringIO(response.text))
            else:
                # 拡張子から判断できない場合はCSVとして試してみる
                self.raw_data = pd.read_csv(StringIO(response.text))
                
            print(f"データの取得に成功しました。行数: {len(self.raw_data)}")
            return self.raw_data
        except Exception as e:
            print(f"データの取得に失敗しました: {e}")
            # サンプルデータを生成（デモ用 - World Happiness Report風）
            self.raw_data = pd.DataFrame({
                'Country': ['Japan', 'USA', 'Germany', 'UK', 'France', 'Canada', 'Australia', 'Sweden', 'Denmark', 'Finland'],
                'Regional indicator': ['East Asia', 'North America', 'Western Europe', 'Western Europe', 'Western Europe', 'North America', 'Oceania', 'Western Europe', 'Western Europe', 'Western Europe'],
                'Ladder score': [5.9, 6.8, 7.1, 6.7, 6.5, 7.2, 7.3, 7.4, 7.6, 7.8],
                'GDP per capita': [1.4, 1.5, 1.45, 1.42, 1.4, 1.45, 1.45, 1.48, 1.5, 1.5],
                'Social support': [0.9, 0.85, 0.9, 0.89, 0.88, 0.92, 0.91, 0.93, 0.95, 0.96],
                'Healthy life expectancy': [0.88, 0.77, 0.89, 0.9, 0.87, 0.9, 0.91, 0.92, 0.93, 0.94],
                'Freedom to make life choices': [0.55, 0.54, 0.60, 0.58, 0.52, 0.62, 0.63, 0.64, 0.66, 0.67],
                'Generosity': [0.1, 0.15, 0.20, 0.25, 0.18, 0.28, 0.30, 0.32, 0.34, 0.35],
                'Perceptions of corruption': [0.6, 0.5, 0.4, 0.45, 0.55, 0.35, 0.33, 0.25, 0.2, 0.18]
            })
            return self.raw_data
            
    def clean_data(self) -> pd.DataFrame:
        """
        データのクリーニングを行う
        Returns:
            DataFrame: クリーニング済みデータ
        """
        if self.raw_data is None:
            self.fetch_data()
            
        # 処理用にデータをコピー
        df = self.raw_data.copy()
        
        # カラム名を標準化（小文字、スペースをアンダースコアに）
        df.columns = [col.lower().replace(' ', '_') for col in df.columns]
        
        # 重複行の削除
        df_size_before = len(df)
        df = df.drop_duplicates()
        print(f"重複削除: {df_size_before - len(df)}行を削除しました")
        
        # 文字列型のカラムの正規化
        for col in df.select_dtypes(include=['object']).columns:
            df[col] = df[col].str.strip().str.lower() if hasattr(df[col], 'str') else df[col]
        
        # 数値型のカラムを取得
        numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
        
        # 欠損値の処理
        for col in df.columns:
            missing_count = df[col].isna().sum()
            if missing_count > 0:
                if col in numeric_cols:
                    # 数値型は中央値で補完
                    median_val = df[col].median()
                    df[col] = df[col].fillna(median_val)
                    print(f"カラム '{col}' の欠損値 {missing_count}個を中央値 {median_val} で補完しました")
                else:
                    # 文字列型は最頻値で補完
                    mode_val = df[col].mode()[0] if not df[col].mode().empty else "unknown"
                    df[col] = df[col].fillna(mode_val)
                    print(f"カラム '{col}' の欠損値 {missing_count}個を最頻値 '{mode_val}' で補完しました")
        
        # 数値型カラムの外れ値処理（3シグマ法）
        for col in numeric_cols:
            # 平均と標準偏差を計算
            mean_val = df[col].mean()
            std_val = df[col].std()
            
            # 外れ値を検出（3シグマ法）
            lower_bound = mean_val - 3 * std_val
            upper_bound = mean_val + 3 * std_val
            
            # 外れ値の数をカウント
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)].index
            outlier_count = len(outliers)
            
            if outlier_count > 0:
                print(f"カラム '{col}' で {outlier_count}個の外れ値を検出しました")
                # 外れ値を削除
                df = df.drop(outliers)
        
        self.processed_data = df
        return df
        
    def analyze_data(self) -> Dict[str, Any]:
        """
        データの分析処理を行う
        Returns:
            Dict: 分析結果
        """
        if self.processed_data is None:
            self.clean_data()
            
        df = self.processed_data.copy()
        analysis_results = {}
        
        # 数値型カラムの基本統計量を計算
        analysis_results['stats'] = df.describe().to_dict()
        
        # 地域別の幸福度スコア
        region_col = 'regional_indicator' if 'regional_indicator' in df.columns else None
        ladder_col = 'ladder_score' if 'ladder_score' in df.columns else None
        
        if region_col and ladder_col:
            # 地域別の平均幸福度
            region_happiness = df.groupby(region_col)[ladder_col].mean().sort_values(ascending=False).to_dict()
            analysis_results['region_happiness'] = region_happiness
            
            # 地域別の幸福度の標準偏差（ばらつき）
            region_happiness_std = df.groupby(region_col)[ladder_col].std().to_dict()
            analysis_results['region_happiness_std'] = region_happiness_std
            
            print(f"地域別の幸福度スコアを計算しました")
        
        # 相関分析：各要因と幸福度の相関
        if ladder_col:
            # 数値型カラムを取得
            numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
            
            if len(numeric_cols) > 1:
                # 幸福度と他の要因の相関を計算
                correlations = {}
                for col in numeric_cols:
                    if col != ladder_col:
                        correlations[col] = df[ladder_col].corr(df[col])
                
                # 相関係数の高い順にソート
                sorted_correlations = {k: v for k, v in sorted(correlations.items(), key=lambda item: abs(item[1]), reverse=True)}
                analysis_results['factor_correlations'] = sorted_correlations
                
                # 全体の相関行列
                correlation_matrix = df[numeric_cols].corr().to_dict()
                analysis_results['correlation_matrix'] = correlation_matrix
                
                print("幸福度と各要因の相関を計算しました")
        
        # 幸福度カテゴリの追加
        if ladder_col:
            # 幸福度をカテゴリに分類（4分位数で分割）
            quantiles = df[ladder_col].quantile([0.25, 0.5, 0.75])
            
            def categorize_happiness(x):
                if x <= quantiles[0.25]:
                    return "low"
                elif x <= quantiles[0.5]:
                    return "medium-low"
                elif x <= quantiles[0.75]:
                    return "medium-high"
                else:
                    return "high"
            
            df['happiness_category'] = df[ladder_col].apply(categorize_happiness)
            
            # 幸福度カテゴリ別の統計
            happiness_category_stats = df.groupby('happiness_category')[numeric_cols].mean().to_dict()
            analysis_results['happiness_category_stats'] = happiness_category_stats
            
            # カテゴリごとの国数をカウント
            country_counts = df['happiness_category'].value_counts().to_dict()
            analysis_results['happiness_category_counts'] = country_counts
            
            print("幸福度カテゴリを追加し、カテゴリ別の統計を計算しました")
        
        # 幸福度の上位・下位10カ国
        country_col = 'country' if 'country' in df.columns else None
        if country_col and ladder_col:
            # 上位10カ国
            top_countries = df.sort_values(by=ladder_col, ascending=False).head(10)[[country_col, ladder_col]].set_index(country_col)[ladder_col].to_dict()
            analysis_results['top_happy_countries'] = top_countries
            
            # 下位10カ国
            bottom_countries = df.sort_values(by=ladder_col, ascending=True).head(10)[[country_col, ladder_col]].set_index(country_col)[ladder_col].to_dict()
            analysis_results['bottom_happy_countries'] = bottom_countries
            
            print("幸福度の上位・下位国を計算しました")
        
        # 要因別の上位国
        if country_col:
            factor_rankings = {}
            for col in numeric_cols:
                if col != ladder_col and col != 'year':  # yearや幸福度以外の要因
                    top_countries = df.sort_values(by=col, ascending=False).head(5)[[country_col, col]].set_index(country_col)[col].to_dict()
                    factor_rankings[col] = top_countries
            
            analysis_results['factor_rankings'] = factor_rankings
            print("各要因のトップ国を計算しました")
        
        self.processed_data = df
        
        # 最終的なデータフレームを辞書形式に変換
        analysis_results['data'] = df.to_dict(orient='records')
        
        return analysis_results

    def get_processed_data(self):
        """
        処理済みデータを取得する
        """
        if self.processed_data is None:
            self.analyze_data()
        return self.processed_data.to_dict(orient='records')

    def get_data_summary(self):
        """
        データの要約情報を取得する
        """
        if self.processed_data is None:
            self.analyze_data()
        
        df = self.processed_data
        
        summary = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'column_types': {col: str(dtype) for col, dtype in df.dtypes.items()},
            'missing_values': df.isna().sum().to_dict(),
            'sample_data': df.head(5).to_dict(orient='records')
        }
        
        return summary

# プログラムのエントリポイント
if __name__ == "__main__":
    processor = DataProcessor()
    processor.fetch_data()
    processor.clean_data()
    results = processor.analyze_data()
    print("処理が完了しました！") 
