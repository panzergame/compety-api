--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Debian 12.5-1.pgdg110+1+b1)
-- Dumped by pg_dump version 13.1 (Debian 13.1-1.pgdg110+1+b1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    "user" integer NOT NULL,
    date timestamp with time zone NOT NULL,
    read boolean NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Comment_Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment_Notification" (
    comment integer
)
INHERITS (public."Notification");


ALTER TABLE public."Comment_Notification" OWNER TO postgres;

--
-- Name: Competency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Competency" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    section text NOT NULL,
    type text NOT NULL
);


ALTER TABLE public."Competency" OWNER TO postgres;

--
-- Name: Group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Group" (
    id integer NOT NULL,
    creator integer NOT NULL,
    title text NOT NULL,
    description text
);


ALTER TABLE public."Group" OWNER TO postgres;

--
-- Name: Group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Group_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Group_id_seq" OWNER TO postgres;

--
-- Name: Group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Group_id_seq" OWNED BY public."Group".id;


--
-- Name: Invite_Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invite_Notification" (
    "group" integer
)
INHERITS (public."Notification");


ALTER TABLE public."Invite_Notification" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Notification_id_seq" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: Section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Section" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    section text
);


ALTER TABLE public."Section" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    login character varying(500) NOT NULL,
    password character varying(500) NOT NULL,
    description character varying(5000),
    dayofbirth date NOT NULL,
    firstname character varying(500) NOT NULL,
    lastname character varying(500) NOT NULL,
    role text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_Commented_Validation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User_Commented_Validation" (
    id integer NOT NULL,
    "user" integer NOT NULL,
    validation integer NOT NULL,
    comment text NOT NULL,
    date timestamp with time zone NOT NULL
);


ALTER TABLE public."User_Commented_Validation" OWNER TO postgres;

--
-- Name: User_Commented_Validation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_Commented_Validation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_Commented_Validation_id_seq" OWNER TO postgres;

--
-- Name: User_Commented_Validation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_Commented_Validation_id_seq" OWNED BY public."User_Commented_Validation".id;


--
-- Name: User_In_Group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User_In_Group" (
    "user" integer NOT NULL,
    "group" integer NOT NULL,
    accepted boolean NOT NULL
);


ALTER TABLE public."User_In_Group" OWNER TO postgres;

--
-- Name: User_Validated_Competency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User_Validated_Competency" (
    id integer NOT NULL,
    "fileName" text,
    file text,
    photo text,
    comment text,
    prev integer,
    "user" integer NOT NULL,
    competency text NOT NULL,
    date timestamp with time zone NOT NULL
);


ALTER TABLE public."User_Validated_Competency" OWNER TO postgres;

--
-- Name: User_Validated_Competency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_Validated_Competency_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_Validated_Competency_id_seq" OWNER TO postgres;

--
-- Name: User_Validated_Competency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_Validated_Competency_id_seq" OWNED BY public."User_Validated_Competency".id;


--
-- Name: User_Verified_Competency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User_Verified_Competency" (
    id integer NOT NULL,
    validation integer NOT NULL,
    validator integer NOT NULL
);


ALTER TABLE public."User_Verified_Competency" OWNER TO postgres;

--
-- Name: User_Verified_Competency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_Verified_Competency_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_Verified_Competency_id_seq" OWNER TO postgres;

--
-- Name: User_Verified_Competency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_Verified_Competency_id_seq" OWNED BY public."User_Verified_Competency".id;


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Verify_Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Verify_Notification" (
    verification integer NOT NULL
)
INHERITS (public."Notification");


ALTER TABLE public."Verify_Notification" OWNER TO postgres;

--
-- Name: Comment_Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment_Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: Group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group" ALTER COLUMN id SET DEFAULT nextval('public."Group_id_seq"'::regclass);


--
-- Name: Invite_Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invite_Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: User_Commented_Validation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User_Commented_Validation" ALTER COLUMN id SET DEFAULT nextval('public."User_Commented_Validation_id_seq"'::regclass);


--
-- Name: User_Validated_Competency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User_Validated_Competency" ALTER COLUMN id SET DEFAULT nextval('public."User_Validated_Competency_id_seq"'::regclass);


--
-- Name: User_Verified_Competency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User_Verified_Competency" ALTER COLUMN id SET DEFAULT nextval('public."User_Verified_Competency_id_seq"'::regclass);


--
-- Name: Verify_Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Verify_Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Data for Name: Comment_Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment_Notification" (id, "user", date, read, comment) FROM stdin;
\.


--
-- Data for Name: Competency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Competency" (id, title, description, section, type) FROM stdin;
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group" (id, creator, title, description) FROM stdin;
\.


--
-- Data for Name: Invite_Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invite_Notification" (id, "user", date, read, "group") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "user", date, read) FROM stdin;
\.


--
-- Data for Name: Section; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Section" (id, title, description, section) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, login, password, description, dayofbirth, firstname, lastname, role) FROM stdin;
\.


--
-- Data for Name: User_Commented_Validation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User_Commented_Validation" (id, "user", validation, comment, date) FROM stdin;
\.


--
-- Data for Name: User_In_Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User_In_Group" ("user", "group", accepted) FROM stdin;
\.


--
-- Data for Name: User_Validated_Competency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User_Validated_Competency" (id, "fileName", file, photo, comment, prev, "user", competency, date) FROM stdin;
\.


--
-- Data for Name: User_Verified_Competency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User_Verified_Competency" (id, validation, validator) FROM stdin;
\.


--
-- Data for Name: Verify_Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Verify_Notification" (id, "user", date, read, verification) FROM stdin;
\.


--
-- Name: Group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Group_id_seq"', 11, true);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, true);


--
-- Name: User_Commented_Validation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_Commented_Validation_id_seq"', 29, true);


--
-- Name: User_Validated_Competency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_Validated_Competency_id_seq"', 34, true);


--
-- Name: User_Verified_Competency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_Verified_Competency_id_seq"', 15, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 8, true);


--
-- Name: Competency Competency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Competency"
    ADD CONSTRAINT "Competency_pkey" PRIMARY KEY (id);


--
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Section Section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Section"
    ADD CONSTRAINT "Section_pkey" PRIMARY KEY (id);


--
-- Name: User_Commented_Validation User_Commented_Validation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User_Commented_Validation"
    ADD CONSTRAINT "User_Commented_Validation_pkey" PRIMARY KEY (id);


--
-- Name: User_In_Group User_In_Group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User_In_Group"
    ADD CONSTRAINT "User_In_Group_pkey" PRIMARY KEY ("user", "group");


--
-- Name: User_Verified_Competency User_Verified_Competency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User_Verified_Competency"
    ADD CONSTRAINT "User_Verified_Competency_pkey" PRIMARY KEY (validation, validator);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

