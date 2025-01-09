from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, BooleanField, DecimalField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, NumberRange

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(max=64)])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

class ProductForm(FlaskForm):
    name = StringField('Product Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired()])
    availability = BooleanField('Available')
    price = DecimalField('Price', validators=[DataRequired(), NumberRange(min=0)])
    submit = SubmitField('Submit')


class DeleteForm(FlaskForm):
    submit = SubmitField('Delete')
