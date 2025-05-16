from flask import Flask, jsonify, request, send_from_directory, after_this_request
from flask_cors import CORS
from data_processor import DataProcessor
import os

app = Flask(__name__)
# より明示的なCORS設定
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# World Happiness Reportデータのデフォルトソース
DEFAULT_DATA_URL = "https://raw.githubusercontent.com/JeffSackmann/tennis_atp/master/atp_rankings_current.csv"
# もし利用可能なら、World Happiness Report 2021のデータを使う
WORLD_HAPPINESS_URL = "https://raw.githubusercontent.com/datahub-project/datahub/main/metadata-ingestion/examples/data_examples/kaggle/world-happiness-report-2021.csv"

# データプロセッサーのインスタンスを作成
data_processor = DataProcessor(WORLD_HAPPINESS_URL)

# すべてのレスポンスにCORSヘッダーを追加
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

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
@app.route('/process', methods=['GET'])  # 互換性のために両方のパスを対応
def process_data():
    """データを処理して分析結果を返すエンドポイント"""
    try:
        # リクエストパスをログに出力
        print(f"リクエストパス: {request.path}")
        print(f"リクエスト元: {request.remote_addr}")
        print(f"リクエストヘッダー: {request.headers}")
        
        # データURLをクエリパラメータから取得（オプション）
        data_url = request.args.get('url', WORLD_HAPPINESS_URL)
        
        # データURLが変更されていれば、新しいプロセッサーを作成
        if data_url != data_processor.data_url:
            new_processor = DataProcessor(data_url)
            results = new_processor.analyze_data()
        else:
            # 既存のプロセッサーを使用
            results = data_processor.analyze_data()
        
        response = jsonify({
            'status': 'success',
            'results': results,
            'message': 'データの処理に成功しました'
        })
        
        return response
    except Exception as e:
        print(f"APIエラー: {str(e)}")
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

# フロントエンドのルート
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """フロントエンドのファイルを提供するための関数"""
    print(f"フロントエンドへのリクエスト: {path}")
    if path != "" and os.path.exists(os.path.join('../frontend/build', path)):
        return send_from_directory('../frontend/build', path)
    else:
        return send_from_directory('../frontend/build', 'index.html')

if __name__ == '__main__':
    # ネットワークインターフェースからのリクエストを受け付ける
    print(f"サーバーを起動します: http://localhost:8000")
    app.run(debug=True, port=8000, host='0.0.0.0') 
