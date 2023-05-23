CREATE TABLE instant (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	serial STRING NOT NULL,
	topic STRING NOT NULL,
	cost INT8 NOT NULL,
	total INT8 NOT NULL,
	released_at TIMESTAMP NOT NULL,
	closed_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id)
);