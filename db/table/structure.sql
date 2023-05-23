CREATE TABLE structure (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	instant_id UUID NOT NULL,
	prize INT8 NOT NULL,
	count INT8 NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (instant_id) REFERENCES instant (id),
	UNIQUE (instant_id, prize)
);