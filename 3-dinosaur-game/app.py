from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder='static', template_folder='templates')


@app.route('/')
def index():
    return render_template('index.html')


# Expose the sprite.png that lives at the project root so JS can load it.
@app.route('/sprite.png')
def sprite_sheet():
    return send_from_directory('.', 'sprite.png', mimetype='image/png')


if __name__ == '__main__':
    # Host on all interfaces so it is easy to run locally or inside a container/VM.
    app.run(host='0.0.0.0', port=5000, debug=True)
