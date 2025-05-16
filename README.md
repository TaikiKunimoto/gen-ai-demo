# 世界幸福度レポート データ可視化アプリケーション

このプロジェクトは、World Happiness Reportのデータを処理し、視覚的に表示するWebアプリケーションです。

## 機能

- HTTPを介したCSV/JSONデータの取得
- データクレンジング（欠損値処理、重複削除、外れ値処理など）
- データ分析（相関分析、統計処理など）
- ReactとChart.jsを使用した視覚的なダッシュボード
- Tailwind CSSによるレスポンシブなUI

## プロジェクト構成

```
.
├── backend/               # Pythonバックエンド
│   ├── app.py             # Flaskアプリケーション
│   ├── data_processor.py  # データ処理クラス
│   └── requirements.txt   # 依存関係
│
└── frontend/              # Reactフロントエンド
    ├── public/            # 静的ファイル
    ├── src/               # ソースコード
    │   ├── components/    # Reactコンポーネント
    │   ├── App.js         # メインアプリケーション
    │   └── index.js       # エントリーポイント
    ├── package.json       # 依存関係
    └── tailwind.config.js # Tailwind CSS設定
```

## セットアップ方法

### バックエンドのセットアップ

1. Pythonの依存関係をインストール:

```bash
cd backend
pip install -r requirements.txt
```

2. バックエンドサーバーを起動:

```bash
python app.py
```

サーバーはデフォルトで http://localhost:5000 で起動します。

### フロントエンドのセットアップ

1. Node.jsの依存関係をインストール:

```bash
cd frontend
npm install
```

2. フロントエンドの開発サーバーを起動:

```bash
npm start
```

アプリケーションはデフォルトで http://localhost:3000 で起動します。

## 使用方法

1. ブラウザで http://localhost:3000 にアクセス
2. デフォルトのWorld Happiness Reportデータが表示されます
3. 「データソース」セクションからデータソースを変更できます
4. ダッシュボードのタブを切り替えて、異なる視点からデータを分析できます

## 技術スタック

- **バックエンド**: Python, Flask, Pandas, NumPy, SciPy
- **フロントエンド**: React, Chart.js, Tailwind CSS
- **データ処理**: Pandas, NumPy
- **視覚化**: Chart.js, react-chartjs-2

## ライセンス

MIT 
