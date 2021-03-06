import executor_utils as eu

import json
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def main():
  return 'Welcome to the homepage.'

@app.route('/execute', methods = ['POST'])
def execute():
  # Supported languages: java ('java'), python ('python'), c++ ('c_cpp').
  data = request.get_json()

  language = data['language']
  code = data['code']
  
  # Call executor_utils to run code.
  print('API called with code %s in %s.' % (code, language))
  result = eu.build_and_execute(code, language)
  print(result)
  
  return jsonify({
    'build': 'Compiled successfully!' if result['build'] == True else result['build'].decode('utf-8'),
    'run': str(result['run']) if result['run'] is None else result['run'].decode('utf-8'),
    'error': str(result['error'])
  })

if __name__ == '__main__':
  app.run(debug=True)