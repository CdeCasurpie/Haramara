from flask_sqlalchemy import SQLAlchemy
import bcrypt

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    url_image = db.Column(db.String(120), nullable=True)
    password = db.Column(db.String(120), nullable=False)

    def __init__(self, username, email, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        self.username = username
        self.email = email
        self.password = hashed_password.decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class BaseLocations(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    address = db.Column(db.String(120), nullable=False)
    country = db.Column(db.String(120), nullable=False)
    comunity = db.Column(db.String(120), nullable=False)
    province = db.Column(db.String(120), nullable=False)
    postal_code = db.Column(db.String(120), nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Locations(BaseLocations):
    __tablename__ = 'locations'

class TemporalLocations(BaseLocations):
    __tablename__ = 'temporal_locations'

class BaseCompanies(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    url_image_logo = db.Column(db.String(120), nullable=True)
    url_image_portada = db.Column(db.String(120), nullable=True)
    name_representative = db.Column(db.String(80), nullable=False)
    last_name_representative = db.Column(db.String(80), nullable=False)
    is_safe = db.Column(db.Boolean, nullable=False)
    has_languages = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return f'<Companies {self.name}>'
    
    def __init__(self, name, email, password, id_location, name_representative, last_name_representative, is_safe, has_languages):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.name = name
        self.email = email
        self.password = hashed_password.decode('utf-8')
        self.id_location = id_location
        self.name_representative = name_representative
        self.last_name_representative = last_name_representative
        self.is_safe = is_safe
        self.has_languages = has_languages

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Companies(BaseCompanies):
    __tablename__ = 'companies'
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)

    def __init__(self, name, email, password, id_location, name_representative, last_name_representative, is_safe, has_languages):
        self.name = name
        self.email = email
        self.password = password
        self.id_location = id_location
        self.name_representative = name_representative
        self.last_name_representative = last_name_representative
        self.is_safe = is_safe
        self.has_languages = has_languages

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

class TemporalCompanies(BaseCompanies):
    __tablename__ = 'temporal_companies'
    id_location = db.Column(db.Integer, db.ForeignKey('temporal_locations.id'), nullable=False)


class Services(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)

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

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    amount = db.Column(db.Float, nullable=False)
    note = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Date, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Activities(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_service = db.Column(db.Integer, db.ForeignKey('services.id'))
    titulo = db.Column(db.String(120), nullable=False)
    ubicacion = db.Column(db.String(512), nullable=False)
    price_per_person = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(240), nullable=False)
    features = db.Column(db.JSON, nullable=False)
    min_age = db.Column(db.Integer, nullable=False)
    initial_vacancies = db.Column(db.Integer, nullable=False)
    tags = db.Column(db.String(120), nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class ShiftActivities(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_activity = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    date = db.Column(db.Enum('Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', name='days_of_week'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Cupos(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_ShiftActivity = db.Column(db.Integer, db.ForeignKey('shift_activities.id'))
    fecha = db.Column(db.Date)
    free_vacancies = db.Column(db.Integer, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Reservations(db.Model):
    id_user = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    id_cupo = db.Column(db.Integer, db.ForeignKey('cupos.id'), primary_key=True)
    id_pago = db.Column(db.Integer, db.ForeignKey('payment.id'), primary_key=True)
    id_activity = db.Column(db.Integer, db.ForeignKey('activities.id'))
    num_persons = db.Column(db.Integer, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Courses(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_service = db.Column(db.Integer, db.ForeignKey('services.id'))
    titulo = db.Column(db.String(120), nullable=False)
    ubicacion = db.Column(db.String(512), nullable=False)
    price = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    adittional_info = db.Column(db.String(240), nullable=False)
    description = db.Column(db.String(800), nullable=False)
    tags = db.Column(db.String(120), nullable=False)
    vacancies = db.Column(db.Integer, nullable=False)
    min_age = db.Column(db.Integer, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()


class ShiftCourses(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_course = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    frequency = db.Column(db.String(7), nullable=False)
    free_vacancies = db.Column(db.Integer, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class registrations(db.Model):
    id_user = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    id_shift_course = db.Column(db.Integer, db.ForeignKey('shift_courses.id'), primary_key=True)
    id_payment = db.Column(db.Integer, db.ForeignKey('payment.id'), primary_key=True)
    id_curso = db.Column(db.Integer, db.ForeignKey('courses.id'))

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_service = db.Column(db.Integer, db.ForeignKey('services.id'))
    name = db.Column(db.String(120), nullable=False)
    general_description = db.Column(db.String(240), nullable=False)
    tags = db.Column(db.String(120), nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Variants(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_product = db.Column(db.Integer, db.ForeignKey('products.id'))
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    specifications = db.Column(db.JSON, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Purchases(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_user = db.Column(db.Integer, db.ForeignKey('users.id'))
    id_payment = db.Column(db.Integer, db.ForeignKey('payment.id'))
    id_location = db.Column(db.Integer, db.ForeignKey('locations.id'))
    contact_telephone = db.Column(db.String(20), nullable=False)
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class PurchaseVariants(db.Model):
    id_purchase = db.Column(db.Integer, db.ForeignKey('purchases.id'), primary_key=True)
    id_variant = db.Column(db.Integer, db.ForeignKey('variants.id'), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    id_product = db.Column(db.Integer, db.ForeignKey('products.id'))

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()