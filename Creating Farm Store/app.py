from flask import Flask, render_template, redirect, url_for, request, session, flash
from config import Config
from models import db, Product
from forms import LoginForm, ProductForm, DeleteForm
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Authentication decorator for admin routes
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            flash('Please log in to access the admin area.', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Home route
@app.route('/')
def index():
    return render_template('index.html')

# Product list for customers
@app.route('/products')
def product_list():
    products = Product.query.all()
    return render_template('product_list.html', products=products)

# Product detail page
@app.route('/product/<int:product_id>')
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    return render_template('product_detail.html', product=product)

# Shopping cart functionality
@app.route('/cart')
def view_cart():
    cart = session.get('cart', [])
    products = Product.query.filter(Product.id.in_(cart)).all() if cart else []
    return render_template('cart.html', products=products)

@app.route('/cart/add/<int:product_id>')
def add_to_cart(product_id):
    cart = session.get('cart', [])
    cart.append(product_id)
    session['cart'] = cart
    flash('Product added to cart.', 'success')
    return redirect(url_for('product_list'))

@app.route('/cart/remove/<int:product_id>')
def remove_from_cart(product_id):
    cart = session.get('cart', [])
    cart = [id for id in cart if id != product_id]
    session['cart'] = cart
    flash('Product removed from cart.', 'info')
    return redirect(url_for('view_cart'))

# Admin login
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.username.data == app.config['ADMIN_USERNAME'] and \
           form.password.data == app.config['ADMIN_PASSWORD']:
            session['logged_in'] = True
            flash('You are now logged in.', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid credentials.', 'danger')
    return render_template('login.html', form=form)

# Admin logout
@app.route('/logout')
def logout():
    session['logged_in'] = False
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

# Admin dashboard
@app.route('/admin')
@login_required
def admin_dashboard():
    products = Product.query.all()
    delete_form = DeleteForm()
    return render_template('admin/admin_dashboard.html', products=products, delete_form=delete_form)

# Add new product
@app.route('/admin/add', methods=['GET', 'POST'])
@login_required
def add_product():
    form = ProductForm()
    if form.validate_on_submit():
        product = Product(
            name=form.name.data,
            description=form.description.data,
            availability=form.availability.data,
            price=form.price.data
        )
        db.session.add(product)
        db.session.commit()
        flash('Product added successfully.', 'success')
        return redirect(url_for('admin_dashboard'))
    return render_template('admin/add_product.html', form=form)

# Edit existing product
@app.route('/admin/edit/<int:product_id>', methods=['GET', 'POST'])
@login_required
def edit_product(product_id):
    product = Product.query.get_or_404(product_id)
    form = ProductForm(obj=product)
    if form.validate_on_submit():
        form.populate_obj(product)
        db.session.commit()
        flash('Product updated successfully.', 'success')
        return redirect(url_for('admin_dashboard'))
    return render_template('admin/edit_product.html', form=form, product=product)

# Delete product
@app.route('/admin/delete/<int:product_id>', methods=['POST'])
@login_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    flash('Product deleted successfully.', 'info')
    return redirect(url_for('admin_dashboard'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
