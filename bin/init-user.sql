CREATE TABLE Users (
  "userId" SERIAL,
  "birthdate" DATE NOT NULL,
  "email" VARCHAR NOT NULL,
  "firstname" VARCHAR NOT NULL,
  "lastname" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  "phoneNumber" VARCHAR,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_id" PRIMARY KEY ("userId")
);


INSERT INTO users(birthdate, email, firstname, lastname, password, "phoneNumber") VALUES ('1994/12/15', 'olivier@test.com', 'olivier', 'lardenois', '$2a$10$32dV/ubzdGW3Ua2bn4o7/ew6x3Rr7pen5YZGwQ5veslIVUxyoCppm', '0606060606');
