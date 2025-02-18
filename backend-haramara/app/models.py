from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    url_image = db.Column(db.String(120), nullable=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Locations(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    direction = db.Column(db.String(120), nullable=False)
    country = db.Column(db.String(120), nullable=False)
    comunities = db.Column(db.String(120), nullable=False)
    province = db.Column(db.String(120), nullable=False)
    postal_code = db.Column(db.String(120), nullable=False)

    def __init__(self, direction, country, comunities, province, postal_code):
        self.direction = direction
        self.country = country
        self.comunities = comunities
        self.province = province
        self.postal_code = postal_code

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Companies(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    url_image_logo = db.Column(db.String(120), nullable=True)
    url_image_portada = db.Column(db.String(120), nullable=True)
    name_representative = db.Column(db.String(80), nullable=False)
    last_name_representative = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<Companies {self.name}>'

    def __init__(self, name, description, name_representative, last_name_representative):
        self.name = name
        self.description = description
        self.name_representative = name_representative
        self.last_name_representative = last_name_representative

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Services(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)

    def __init__(self, company_id):
        self.company_id = company_id

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class ImagesServices(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    url_image = db.Column(db.String(120), nullable=False)
    id_service = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)

    def __repr__(self):
        return f'<ImagesServices {self.url_image}>'

    def __init__(self, url_image, id_service):
        self.url_image = url_image
        self.id_service = id_service

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()



