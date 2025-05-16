from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from data_processor import DataProcessor
import os

app = Flask(__name__)
CORS(app)  # Cross-Origin Resource Sharingを有効化

# World Happiness Reportデータのデフォルトソース
DEFAULT_DATA_URL = "https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master/atp_rankings_current.csv"
# もし利用可能なら、World Happiness Report 2021のデータを使う
WORLD_HAPPINESS_URL = "https://raw.githubusercontent.com/datahub-project/datahub/main/metadata-ingestion/examples/data_examples/kaggle/world-happiness-report-2021.csv"

# データプロセッサーのインスタンスを作成
data_processor = DataProcessor(WORLD_HAPPINESS_URL)

@app.route('/api/data', methods=['GET'])
def get_data():
    """生データを取得するエンドポイント"""
    try:
        data = data_processor.fetch_data()
        return jsonify({
            'status': 'success',
            'data': data.to_dict(orient='records'),
            'message': 'データの取得に成功しました'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'エラーが発生しました: {str(e)}'
        }), 500

@app.route('/api/process', methods=['GET'])
def process_data():
    """データを処理して分析結果を返すエンドポイント"""
    try:
        # データURLをクエリパラメータから取得（オプション）
        data_url = request.args.get('url', WORLD_HAPPINESS_URL)
        
        # データURLが変更されていれば、新しいプロセッサーを作成
        if data_url != data_processor.data_url:
            new_processor = DataProcessor(data_url)
            results = new_processor.analyze_data()
        else:
            # 既存のプロセッサーを使用
            results = data_processor.analyze_data()
            
        return jsonify({
            'status': 'success',
            'results': results,
            'message': 'データの処理に成功しました'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'エラーが発生しました: {str(e)}'
        }), 500

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """データの要約情報を取得するエンドポイント"""
    try:
        summary = data_processor.get_data_summary()
        return jsonify({
            'status': 'success',
            'summary': summary,
            'message': 'データサマリーの取得に成功しました'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'エラーが発生しました: {str(e)}'
        }), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """フロントエンドのファイルを提供するための関数"""
    if path != "" and os.path.exists(os.path.join('../frontend/build', path)):
        return send_from_directory('../frontend/build', path)
    else:
        return send_from_directory('../frontend/build', 'index.html')

if __name__ == '__main__':
    # 開発環境ではデバッグモードを有効化
    app.run(debug=True, port=5000) 
