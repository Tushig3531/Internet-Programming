from flask import Flask, redirect, url_for, session
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = '2ba09e14a9ba65467bbc84a2c1da05a9425a89f157e812da'


oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id='GOOGLE_CLIENT_ID',  
    client_secret='GOOGLE_CLIENT_SECRET',  
    api_base_url='https://openidconnect.googleapis.com/v1/',
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs',
    client_kwargs={'scope': 'openid email profile'}
)

@app.route('/')
def index():
    if 'user' in session:
        user = session['user']
        return f"""
            <h1>Welcome, {user['name']}!</h1>
            <p>Email: {user['email']}</p>
            <img src="{user['picture']}" alt="Profile Picture" width="200">
            <p><a href="/logout">Logout</a></p>
        """
    return '<a href="/login">Login with Google</a>'

@app.route('/login')
def login():
    
    return google.authorize_redirect('https://erdetu01.luther.edu:5000/authorize')




@app.route('/authorize')
def authorize():
    try:
        
        token = google.authorize_access_token()
        
        user_info = google.get('userinfo').json()


        session['user'] = {
            'email': user_info['email'],
            'picture': user_info['picture'],
            'name': user_info['name'],
        }
        return redirect(url_for('index'))
    except Exception as e:
        return f"Authorization failed: {str(e)}"

@app.route('/logout')
def logout():

    session.pop('user', None)
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(host='erdetu01.luther.edu', port=5000, ssl_context=('cert.pem', 'key.pem'))


