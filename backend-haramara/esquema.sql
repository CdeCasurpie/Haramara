CREATE TABLE users (
	id INTEGER NOT NULL, 
	username VARCHAR(80) NOT NULL, 
	email VARCHAR(120) NOT NULL, 
	url_image VARCHAR(120), 
	password VARCHAR(120) NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (email)
);
CREATE TABLE locations (
	id INTEGER NOT NULL, 
	address VARCHAR(120) NOT NULL, 
	country VARCHAR(120) NOT NULL, 
	comunity VARCHAR(120) NOT NULL, 
	province VARCHAR(120) NOT NULL, 
	postal_code VARCHAR(120) NOT NULL, 
	PRIMARY KEY (id)
);
CREATE TABLE temporal_locations (
	id INTEGER NOT NULL, 
	address VARCHAR(120) NOT NULL, 
	country VARCHAR(120) NOT NULL, 
	comunity VARCHAR(120) NOT NULL, 
	province VARCHAR(120) NOT NULL, 
	postal_code VARCHAR(120) NOT NULL, 
	PRIMARY KEY (id)
);
CREATE TABLE payment (
	id INTEGER NOT NULL, 
	amount FLOAT NOT NULL, 
	note VARCHAR(120) NOT NULL, 
	date DATE NOT NULL, 
	PRIMARY KEY (id)
);
CREATE TABLE companies (
	id_location INTEGER NOT NULL, 
	id INTEGER NOT NULL, 
	name VARCHAR(80) NOT NULL, 
	email VARCHAR(120) NOT NULL, 
	password VARCHAR(120) NOT NULL, 
	url_image_logo VARCHAR(120), 
	url_image_portada VARCHAR(120), 
	name_representative VARCHAR(80) NOT NULL, 
	last_name_representative VARCHAR(80) NOT NULL, 
	is_safe BOOLEAN NOT NULL, 
	has_languages BOOLEAN NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_location) REFERENCES locations (id), 
	UNIQUE (name), 
	UNIQUE (email)
);
CREATE TABLE temporal_companies (
	id_location INTEGER NOT NULL, 
	id INTEGER NOT NULL, 
	name VARCHAR(80) NOT NULL, 
	email VARCHAR(120) NOT NULL, 
	password VARCHAR(120) NOT NULL, 
	url_image_logo VARCHAR(120), 
	url_image_portada VARCHAR(120), 
	name_representative VARCHAR(80) NOT NULL, 
	last_name_representative VARCHAR(80) NOT NULL, 
	is_safe BOOLEAN NOT NULL, 
	has_languages BOOLEAN NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_location) REFERENCES temporal_locations (id), 
	UNIQUE (name), 
	UNIQUE (email)
);
CREATE TABLE purchases (
	id INTEGER NOT NULL, 
	id_user INTEGER, 
	id_payment INTEGER, 
	id_location INTEGER, 
	contact_telephone VARCHAR(20) NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_user) REFERENCES users (id), 
	FOREIGN KEY(id_payment) REFERENCES payment (id), 
	FOREIGN KEY(id_location) REFERENCES locations (id)
);
CREATE TABLE services (
	id INTEGER NOT NULL, 
	company_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(company_id) REFERENCES companies (id)
);
CREATE TABLE images_services (
	id INTEGER NOT NULL, 
	url_image VARCHAR(120) NOT NULL, 
	id_service INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_service) REFERENCES services (id)
);
CREATE TABLE activities (
	id INTEGER NOT NULL, 
	id_service INTEGER, 
	titulo VARCHAR(120) NOT NULL, 
	id_ubicacion INTEGER NOT NULL, 
	price_per_person FLOAT NOT NULL, 
	description VARCHAR(240) NOT NULL, 
	features JSON NOT NULL, 
	min_age INTEGER NOT NULL, 
	initial_vacancies INTEGER NOT NULL, 
	tags VARCHAR(120) NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_service) REFERENCES services (id), 
	FOREIGN KEY(id_ubicacion) REFERENCES locations (id)
);
CREATE TABLE courses (
	id INTEGER NOT NULL, 
	id_service INTEGER, 
	titulo VARCHAR(120) NOT NULL, 
	id_ubicacion INTEGER NOT NULL, 
	price FLOAT NOT NULL, 
	start_date DATE NOT NULL, 
	end_date DATE NOT NULL, 
	adittional_info VARCHAR(240) NOT NULL, 
	details VARCHAR(800) NOT NULL, 
	tags VARCHAR(120) NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_service) REFERENCES services (id), 
	FOREIGN KEY(id_ubicacion) REFERENCES locations (id)
);
CREATE TABLE products (
	id INTEGER NOT NULL, 
	id_service INTEGER, 
	name VARCHAR(120) NOT NULL, 
	general_description VARCHAR(240) NOT NULL, 
	tags VARCHAR(120) NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_service) REFERENCES services (id)
);
CREATE TABLE shift_activities (
	id INTEGER NOT NULL, 
	id_activity INTEGER NOT NULL, 
	start_time TIME NOT NULL, 
	end_time TIME NOT NULL, 
	date VARCHAR(2) NOT NULL, 
	start_date DATE NOT NULL, 
	end_date DATE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_activity) REFERENCES activities (id)
);
CREATE TABLE shift_courses (
	id INTEGER NOT NULL, 
	id_course INTEGER NOT NULL, 
	start_time TIME NOT NULL, 
	end_time TIME NOT NULL, 
	frequency VARCHAR(7) NOT NULL, 
	vacancies INTEGER NOT NULL, 
	free_vacancies INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_course) REFERENCES courses (id)
);
CREATE TABLE variants (
	id INTEGER NOT NULL, 
	id_product INTEGER, 
	name VARCHAR(120) NOT NULL, 
	price FLOAT NOT NULL, 
	stock INTEGER NOT NULL, 
	specifications JSON NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(id_product) REFERENCES products (id)
);
CREATE TABLE cupos (
	id INTEGER NOT NULL, 
	"id_ShiftActivity" INTEGER, 
	fecha DATE, 
	free_vacancies INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY("id_ShiftActivity") REFERENCES shift_activities (id)
);
CREATE TABLE registrations (
	id_user INTEGER NOT NULL, 
	id_shift_course INTEGER NOT NULL, 
	id_payment INTEGER NOT NULL, 
	id_curso INTEGER, 
	PRIMARY KEY (id_user, id_shift_course, id_payment), 
	FOREIGN KEY(id_user) REFERENCES users (id), 
	FOREIGN KEY(id_shift_course) REFERENCES shift_courses (id), 
	FOREIGN KEY(id_payment) REFERENCES payment (id), 
	FOREIGN KEY(id_curso) REFERENCES courses (id)
);
CREATE TABLE purchase_variants (
	id_purchase INTEGER NOT NULL, 
	id_variant INTEGER NOT NULL, 
	quantity INTEGER NOT NULL, 
	id_product INTEGER, 
	PRIMARY KEY (id_purchase, id_variant), 
	FOREIGN KEY(id_purchase) REFERENCES purchases (id), 
	FOREIGN KEY(id_variant) REFERENCES variants (id), 
	FOREIGN KEY(id_product) REFERENCES products (id)
);
CREATE TABLE reservations (
	id_user INTEGER NOT NULL, 
	id_cupo INTEGER NOT NULL, 
	id_pago INTEGER NOT NULL, 
	id_activity INTEGER, 
	num_persons INTEGER NOT NULL, 
	PRIMARY KEY (id_user, id_cupo, id_pago), 
	FOREIGN KEY(id_user) REFERENCES users (id), 
	FOREIGN KEY(id_cupo) REFERENCES cupos (id), 
	FOREIGN KEY(id_pago) REFERENCES payment (id), 
	FOREIGN KEY(id_activity) REFERENCES activities (id)
);
