-- Seeing as we will be testing out this script alot we can destroy the db before creating everything again
-- DROP DATABASE IF EXISTS gaspsweassignment2024db;

-- Create the db
-- CREATE DATABASE gaspsweassignment2024db;

-- Move into the db
\c gaspsweassignment2024db

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:13:50

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
-- TOC entry 219 (class 1259 OID 16439)
-- Name: EmploymentStatuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmploymentStatuses" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."EmploymentStatuses" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16438)
-- Name: EmploymentStatuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EmploymentStatuses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EmploymentStatuses_id_seq" OWNER TO postgres;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 218
-- Name: EmploymentStatuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EmploymentStatuses_id_seq" OWNED BY public."EmploymentStatuses".id;


--
-- TOC entry 3246 (class 2604 OID 16442)
-- Name: EmploymentStatuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmploymentStatuses" ALTER COLUMN id SET DEFAULT nextval('public."EmploymentStatuses_id_seq"'::regclass);


--
-- TOC entry 3393 (class 0 OID 16439)
-- Dependencies: 219
-- Data for Name: EmploymentStatuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmploymentStatuses" (id, name, "createdAt", "updatedAt") FROM stdin;
1	Unemployed	2024-09-08 07:45:50.063+00	2024-09-08 07:45:50.063+00
2	Employed	2024-09-08 07:45:54.975+00	2024-09-08 07:45:54.975+00
3	Self-employed	2024-09-08 07:46:03.23+00	2024-09-08 07:46:03.23+00
\.


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 218
-- Name: EmploymentStatuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EmploymentStatuses_id_seq"', 3, true);


--
-- TOC entry 3248 (class 2606 OID 16444)
-- Name: EmploymentStatuses EmploymentStatuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmploymentStatuses"
    ADD CONSTRAINT "EmploymentStatuses_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:13:50

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:14:43

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
-- TOC entry 224 (class 1259 OID 16452)
-- Name: MaritalStatuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MaritalStatuses" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."MaritalStatuses" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16446)
-- Name: MaritalStatuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MaritalStatuses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MaritalStatuses_id_seq" OWNER TO postgres;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 221
-- Name: MaritalStatuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MaritalStatuses_id_seq" OWNED BY public."MaritalStatuses".id;


--
-- TOC entry 3246 (class 2604 OID 16457)
-- Name: MaritalStatuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaritalStatuses" ALTER COLUMN id SET DEFAULT nextval('public."MaritalStatuses_id_seq"'::regclass);


--
-- TOC entry 3393 (class 0 OID 16452)
-- Dependencies: 224
-- Data for Name: MaritalStatuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MaritalStatuses" (id, name, "createdAt", "updatedAt") FROM stdin;
1	Single	2024-09-08 07:46:28.696+00	2024-09-08 07:46:28.696+00
2	Married	2024-09-08 07:46:32.428+00	2024-09-08 07:46:32.428+00
3	Divorced	2024-09-08 07:46:36.283+00	2024-09-08 07:46:36.283+00
4	Widowed	2024-09-09 21:14:02.842+00	2024-09-09 21:14:02.842+00
\.


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 221
-- Name: MaritalStatuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MaritalStatuses_id_seq"', 4, true);


--
-- TOC entry 3248 (class 2606 OID 16463)
-- Name: MaritalStatuses MaritalStatuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaritalStatuses"
    ADD CONSTRAINT "MaritalStatuses_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:14:43

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:14:05

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
-- TOC entry 222 (class 1259 OID 16447)
-- Name: Genders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Genders" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Genders" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16445)
-- Name: Genders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Genders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Genders_id_seq" OWNER TO postgres;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 220
-- Name: Genders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Genders_id_seq" OWNED BY public."Genders".id;


--
-- TOC entry 3246 (class 2604 OID 16451)
-- Name: Genders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Genders" ALTER COLUMN id SET DEFAULT nextval('public."Genders_id_seq"'::regclass);


--
-- TOC entry 3393 (class 0 OID 16447)
-- Dependencies: 222
-- Data for Name: Genders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Genders" (id, name, "createdAt", "updatedAt") FROM stdin;
1	Male	2024-09-07 18:53:55.288+00	2024-09-07 18:53:55.288+00
2	Female	2024-09-07 18:54:02.68+00	2024-09-07 18:54:02.68+00
\.


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 220
-- Name: Genders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Genders_id_seq"', 3, true);


--
-- TOC entry 3248 (class 2606 OID 16460)
-- Name: Genders Genders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Genders"
    ADD CONSTRAINT "Genders_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:14:05

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:15:55

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
-- TOC entry 227 (class 1259 OID 16693)
-- Name: Relationships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Relationships" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Relationships" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16692)
-- Name: Relationships_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Relationships_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Relationships_id_seq" OWNER TO postgres;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 226
-- Name: Relationships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Relationships_id_seq" OWNED BY public."Relationships".id;


--
-- TOC entry 3246 (class 2604 OID 16696)
-- Name: Relationships id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Relationships" ALTER COLUMN id SET DEFAULT nextval('public."Relationships_id_seq"'::regclass);


--
-- TOC entry 3393 (class 0 OID 16693)
-- Dependencies: 227
-- Data for Name: Relationships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Relationships" (id, name, "createdAt", "updatedAt") FROM stdin;
1	Parent	2024-09-09 21:32:24.628+00	2024-09-09 21:32:24.628+00
2	Spouse	2024-09-09 21:32:29.394+00	2024-09-09 21:32:29.394+00
3	Child	2024-09-09 21:32:33.181+00	2024-09-09 21:32:33.181+00
4	Grandparent	2024-09-09 21:32:38.189+00	2024-09-09 21:32:38.189+00
5	Others	2024-09-09 21:32:42.397+00	2024-09-09 21:32:42.397+00
6	Unrelated	2024-09-09 21:32:46.462+00	2024-09-09 21:32:46.462+00
\.


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 226
-- Name: Relationships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Relationships_id_seq"', 6, true);


--
-- TOC entry 3248 (class 2606 OID 16698)
-- Name: Relationships Relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Relationships"
    ADD CONSTRAINT "Relationships_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:15:55

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:15:20

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
-- TOC entry 225 (class 1259 OID 16456)
-- Name: PermissionScopes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PermissionScopes" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PermissionScopes" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16450)
-- Name: PermissionScopes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PermissionScopes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PermissionScopes_id_seq" OWNER TO postgres;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 223
-- Name: PermissionScopes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PermissionScopes_id_seq" OWNED BY public."PermissionScopes".id;


--
-- TOC entry 3246 (class 2604 OID 16461)
-- Name: PermissionScopes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PermissionScopes" ALTER COLUMN id SET DEFAULT nextval('public."PermissionScopes_id_seq"'::regclass);


--
-- TOC entry 3393 (class 0 OID 16456)
-- Dependencies: 225
-- Data for Name: PermissionScopes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PermissionScopes" (id, name, "createdAt", "updatedAt") FROM stdin;
1	Applicant	2024-09-07 19:16:37.047+00	2024-09-07 19:16:37.047+00
2	Applications	2024-09-07 19:16:41.177+00	2024-09-07 19:16:41.177+00
3	CodeTables	2024-09-07 19:16:44.599+00	2024-09-07 19:16:44.599+00
4	Households	2024-09-07 19:16:48.18+00	2024-09-07 19:16:48.18+00
5	Scheme	2024-09-07 19:16:51.357+00	2024-09-07 19:16:51.357+00
6	User	2024-09-07 19:16:54.443+00	2024-09-07 19:16:54.443+00
\.


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 223
-- Name: PermissionScopes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PermissionScopes_id_seq"', 6, true);


--
-- TOC entry 3248 (class 2606 OID 16465)
-- Name: PermissionScopes PermissionScopes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PermissionScopes"
    ADD CONSTRAINT "PermissionScopes_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:15:20

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:11:42

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
-- TOC entry 217 (class 1259 OID 16432)
-- Name: AdminRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AdminRoles" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."AdminRoles" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16431)
-- Name: AdminRoles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AdminRoles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AdminRoles_id_seq" OWNER TO postgres;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 216
-- Name: AdminRoles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AdminRoles_id_seq" OWNED BY public."AdminRoles".id;


--
-- TOC entry 3246 (class 2604 OID 16435)
-- Name: AdminRoles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminRoles" ALTER COLUMN id SET DEFAULT nextval('public."AdminRoles_id_seq"'::regclass);


--
-- TOC entry 3393 (class 0 OID 16432)
-- Dependencies: 217
-- Data for Name: AdminRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AdminRoles" (id, name, "createdAt", "updatedAt") FROM stdin;
1	Owner	2024-09-07 19:16:10.899+00	2024-09-07 19:16:10.899+00
2	Reader	2024-09-07 19:16:16.775+00	2024-09-07 19:16:16.775+00
3	Contributor	2024-09-07 19:16:23.018+00	2024-09-07 19:16:23.018+00
\.


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 216
-- Name: AdminRoles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AdminRoles_id_seq"', 3, true);


--
-- TOC entry 3248 (class 2606 OID 16437)
-- Name: AdminRoles AdminRoles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminRoles"
    ADD CONSTRAINT "AdminRoles_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:11:43

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:16:29

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
-- TOC entry 215 (class 1259 OID 16426)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 3391 (class 0 OID 16426)
-- Dependencies: 215
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, "createdAt", "updatedAt") FROM stdin;
39fef02a-2448-480e-85da-138111242a33	Koh Wen Hao	koh_wen_hao@cpf.gov.sg	2024-09-08 16:02:28.057+00	2024-09-09 08:24:09.115+00
7121a198-fc3d-4e59-8801-6afd194ce3d7	Suraj Jayabalan	suraj_jayabalan@cpf.gov.sg	2024-09-09 21:36:23.829+00	2024-09-09 21:36:23.829+00
\.


--
-- TOC entry 3247 (class 2606 OID 16430)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:16:30

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:15:43

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
-- TOC entry 234 (class 1259 OID 16773)
-- Name: Permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permissions" (
    id uuid NOT NULL,
    "AdminRoleId" integer,
    "PermissionScopeId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Permissions" OWNER TO postgres;

--
-- TOC entry 3395 (class 0 OID 16773)
-- Dependencies: 234
-- Data for Name: Permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permissions" (id, "AdminRoleId", "PermissionScopeId", "createdAt", "updatedAt") FROM stdin;
77d2f4db-da92-4baf-9350-ba42c4b2ba80	2	6	2024-09-09 11:30:57.516+00	2024-09-09 11:30:57.516+00
adb7c555-7088-498b-bf71-1af1b0c42e90	3	6	2024-09-09 11:31:10.575+00	2024-09-09 11:31:10.575+00
ca9d8125-807e-46df-a386-b25436fda845	2	1	2024-09-09 11:32:52.026+00	2024-09-09 11:32:52.026+00
6fe1107b-90a0-4bc2-a6d7-b2bc6c433534	3	1	2024-09-09 11:33:10.731+00	2024-09-09 11:33:10.731+00
93a9ec7d-01b7-405b-b3d2-71980439b4b4	3	2	2024-09-09 21:39:09.791+00	2024-09-09 21:39:09.791+00
9e5fb93d-3845-4bca-a42b-d077ad539508	3	3	2024-09-09 21:39:14.124+00	2024-09-09 21:39:14.124+00
ccd43018-e3ff-4572-9ba4-20670b10e1cd	3	4	2024-09-09 21:39:15.599+00	2024-09-09 21:39:15.599+00
2db05656-f50a-4bd1-82ee-862e3aa90390	3	5	2024-09-09 21:39:17.114+00	2024-09-09 21:39:17.114+00
a78275cc-4355-4bdd-be92-8c4950d9d1de	2	2	2024-09-09 21:39:36.757+00	2024-09-09 21:39:36.757+00
96acf4dc-ab4f-4256-909e-6d7bc9fc7862	2	3	2024-09-09 21:39:38.555+00	2024-09-09 21:39:38.555+00
b71682a0-6538-44c3-9d64-a6cf8636523f	2	4	2024-09-09 21:39:40.256+00	2024-09-09 21:39:40.256+00
38385068-9e09-4adb-9df8-cb95853d68cf	2	5	2024-09-09 21:39:42.763+00	2024-09-09 21:39:42.763+00
6c34a21d-efe4-4a4f-ac3f-ad3682a279ff	1	6	2024-09-09 21:40:32.052+00	2024-09-09 21:40:32.052+00
\.


--
-- TOC entry 3247 (class 2606 OID 16779)
-- Name: Permissions Permissions_AdminRoleId_PermissionScopeId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions"
    ADD CONSTRAINT "Permissions_AdminRoleId_PermissionScopeId_key" UNIQUE ("AdminRoleId", "PermissionScopeId");


--
-- TOC entry 3249 (class 2606 OID 16777)
-- Name: Permissions Permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions"
    ADD CONSTRAINT "Permissions_pkey" PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 16780)
-- Name: Permissions Permissions_AdminRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions"
    ADD CONSTRAINT "Permissions_AdminRoleId_fkey" FOREIGN KEY ("AdminRoleId") REFERENCES public."AdminRoles"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3251 (class 2606 OID 16785)
-- Name: Permissions Permissions_PermissionScopeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions"
    ADD CONSTRAINT "Permissions_PermissionScopeId_fkey" FOREIGN KEY ("PermissionScopeId") REFERENCES public."PermissionScopes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2024-09-10 06:15:43

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:15:04

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
-- TOC entry 233 (class 1259 OID 16755)
-- Name: PermissionAssignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PermissionAssignments" (
    id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "PermissionId" uuid,
    "UserId" uuid
);


ALTER TABLE public."PermissionAssignments" OWNER TO postgres;

--
-- TOC entry 3394 (class 0 OID 16755)
-- Dependencies: 233
-- Data for Name: PermissionAssignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PermissionAssignments" (id, "createdAt", "updatedAt", "PermissionId", "UserId") FROM stdin;
18bc601a-a3fb-4ffd-9c8f-b706614449e4	2024-09-09 11:44:46.182+00	2024-09-09 11:44:46.182+00	77d2f4db-da92-4baf-9350-ba42c4b2ba80	39fef02a-2448-480e-85da-138111242a33
275ceb29-8931-49dd-a245-4a37c55bef09	2024-09-09 11:44:50.227+00	2024-09-09 11:44:50.227+00	adb7c555-7088-498b-bf71-1af1b0c42e90	39fef02a-2448-480e-85da-138111242a33
\.


--
-- TOC entry 3247 (class 2606 OID 16761)
-- Name: PermissionAssignments PermissionAssignments_PermissionId_UserId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PermissionAssignments"
    ADD CONSTRAINT "PermissionAssignments_PermissionId_UserId_key" UNIQUE ("PermissionId", "UserId");


--
-- TOC entry 3249 (class 2606 OID 16759)
-- Name: PermissionAssignments PermissionAssignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PermissionAssignments"
    ADD CONSTRAINT "PermissionAssignments_pkey" PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 16767)
-- Name: PermissionAssignments PermissionAssignments_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PermissionAssignments"
    ADD CONSTRAINT "PermissionAssignments_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2024-09-10 06:15:04

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:12:09

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
-- TOC entry 228 (class 1259 OID 16699)
-- Name: Applicants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Applicants" (
    id uuid NOT NULL,
    "EmploymentStatusId" integer,
    "MaritalStatusId" integer,
    "GenderId" integer,
    name character varying(50) NOT NULL,
    email character varying(50),
    mobile_no character varying(31),
    birth_date date,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Applicants" OWNER TO postgres;

--
-- TOC entry 3391 (class 0 OID 16699)
-- Dependencies: 228
-- Data for Name: Applicants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Applicants" (id, "EmploymentStatusId", "MaritalStatusId", "GenderId", name, email, mobile_no, birth_date, "createdAt", "updatedAt") FROM stdin;
c5c697d0-31c9-4386-ac6a-09ebb9ff3c42	3	2	2	Kwok Siu Ching	janekwok88@gmail.com	+6512345678	1988-05-02	2024-09-09 05:31:31.085+00	2024-09-09 05:31:31.085+00
cac1c073-6e00-4878-99d4-8cc79b62ea97	2	1	1	Jon Tan	jontanwenghou@gmail.com	+6587654321	2003-08-08	2024-09-09 08:11:22.412+00	2024-09-09 08:11:22.412+00
c7eae7bd-ebfb-4da5-bb8d-a6a4f63e27e3	1	1	2	Tan Bee Hua	tbh113388@gmail.com	+652353535	1961-01-03	2024-09-09 22:09:48.076+00	2024-09-09 22:09:48.076+00
027d9a40-b8cc-4ab3-a831-c232f2617c1f	3	1	1	Joe Linder	jolinder@gmail.com	+6577777777	1994-01-03	2024-09-09 22:10:06.153+00	2024-09-09 22:10:06.153+00
\.


--
-- TOC entry 3247 (class 2606 OID 16703)
-- Name: Applicants Applicants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Applicants"
    ADD CONSTRAINT "Applicants_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:12:10

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:14:21

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
-- TOC entry 229 (class 1259 OID 16704)
-- Name: HouseholdMembers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HouseholdMembers" (
    id uuid NOT NULL,
    "EmploymentStatusId" integer,
    "MaritalStatusId" integer,
    "GenderId" integer,
    "RelationshipId" integer,
    name character varying(50) NOT NULL,
    email character varying(50),
    mobile_no character varying(31),
    birth_date date,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ApplicantId" uuid
);


ALTER TABLE public."HouseholdMembers" OWNER TO postgres;

--
-- TOC entry 3392 (class 0 OID 16704)
-- Dependencies: 229
-- Data for Name: HouseholdMembers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."HouseholdMembers" (id, "EmploymentStatusId", "MaritalStatusId", "GenderId", "RelationshipId", name, email, mobile_no, birth_date, "createdAt", "updatedAt", "ApplicantId") FROM stdin;
5304f22a-5725-4e2a-89ae-b56b792311cf	1	1	1	3	Kwok Fu Chen	sammykdkwok@gmail.com	+6577777777	2016-03-11	2024-09-09 05:31:31.133+00	2024-09-09 05:31:31.133+00	c5c697d0-31c9-4386-ac6a-09ebb9ff3c42
00ed2b80-cfa4-4cca-a576-9ad3c0d9bc6a	1	1	2	3	Kwok Fu Mei	\N	\N	2016-03-11	2024-09-09 05:31:31.133+00	2024-09-09 05:31:31.133+00	c5c697d0-31c9-4386-ac6a-09ebb9ff3c42
\.


--
-- TOC entry 3247 (class 2606 OID 16708)
-- Name: HouseholdMembers HouseholdMembers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HouseholdMembers"
    ADD CONSTRAINT "HouseholdMembers_pkey" PRIMARY KEY (id);


--
-- TOC entry 3248 (class 2606 OID 16709)
-- Name: HouseholdMembers HouseholdMembers_ApplicantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HouseholdMembers"
    ADD CONSTRAINT "HouseholdMembers_ApplicantId_fkey" FOREIGN KEY ("ApplicantId") REFERENCES public."Applicants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2024-09-10 06:14:21

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:16:16

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
-- TOC entry 230 (class 1259 OID 16714)
-- Name: Schemes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Schemes" (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    eligibility_criteria text,
    description character varying(1000),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Schemes" OWNER TO postgres;

--
-- TOC entry 3391 (class 0 OID 16714)
-- Dependencies: 230
-- Data for Name: Schemes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Schemes" (id, name, eligibility_criteria, description, "createdAt", "updatedAt") FROM stdin;
1bed3b60-2988-4a7e-b47b-3825295a8b10	Retrenchment Assistance Scheme	{"name":"unemployed-female","conditions":{"all":[{"fact":"applicant-details","path":"$.GenderId","operator":"equal","value":2},{"fact":"applicant-details","path":"$.EmploymentStatusId","operator":"equal","value":1}]},"event":{"type":"unemployed-male","params":{"message":"Applicant is an unemployed female"}}}	Scheme to help citizens who are recently retrenched	2024-09-09 06:49:24.596+00	2024-09-09 22:02:49.496+00
\.


--
-- TOC entry 3247 (class 2606 OID 16720)
-- Name: Schemes Schemes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schemes"
    ADD CONSTRAINT "Schemes_pkey" PRIMARY KEY (id);


-- Completed on 2024-09-10 06:16:16

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:27:02

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
-- TOC entry 231 (class 1259 OID 16721)
-- Name: Benefits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Benefits" (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    amount bigint,
    description character varying(1000),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "SchemeId" uuid
);


ALTER TABLE public."Benefits" OWNER TO postgres;

--
-- TOC entry 3392 (class 0 OID 16721)
-- Dependencies: 231
-- Data for Name: Benefits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Benefits" (id, name, amount, description, "createdAt", "updatedAt", "SchemeId") FROM stdin;
b6fdfc27-f9b9-41d9-9ca8-31e7156d8fab	SkillsFuture Credits	3000	Additional SkillsFuture Credits	2024-09-09 06:49:24.646+00	2024-09-09 06:49:24.646+00	1bed3b60-2988-4a7e-b47b-3825295a8b10
56bd2e05-4208-4194-b822-5da8ce4d2a6a	CDC Vouchers	600	Additional CDC Vouchers	2024-09-09 06:49:24.646+00	2024-09-09 06:49:24.646+00	1bed3b60-2988-4a7e-b47b-3825295a8b10
1f77d974-2e85-41fd-961f-ccd4536cff28	School Meal Vouchers	5	Daily school meal vouchers for applicants with children attending primary school	2024-09-09 06:49:24.647+00	2024-09-09 06:49:24.647+00	1bed3b60-2988-4a7e-b47b-3825295a8b10
25d67480-2d69-45f8-8f14-94e32d9e2e31	CPF Medisave Account Top Up	600	Top up to CPF Medisave Account	2024-09-09 06:52:15.199+00	2024-09-09 06:52:15.199+00	1bed3b60-2988-4a7e-b47b-3825295a8b10
\.


--
-- TOC entry 3247 (class 2606 OID 16727)
-- Name: Benefits Benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Benefits"
    ADD CONSTRAINT "Benefits_pkey" PRIMARY KEY (id);


--
-- TOC entry 3248 (class 2606 OID 16728)
-- Name: Benefits Benefits_SchemeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Benefits"
    ADD CONSTRAINT "Benefits_SchemeId_fkey" FOREIGN KEY ("SchemeId") REFERENCES public."Schemes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2024-09-10 06:27:03

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-10 06:13:23

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
-- TOC entry 232 (class 1259 OID 16733)
-- Name: Applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Applications" (
    id uuid NOT NULL,
    outcome character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ApplicantId" uuid,
    "SchemeId" uuid
);


ALTER TABLE public."Applications" OWNER TO postgres;

--
-- TOC entry 3395 (class 0 OID 16733)
-- Dependencies: 232
-- Data for Name: Applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Applications" (id, outcome, "createdAt", "updatedAt", "ApplicantId", "SchemeId") FROM stdin;
\.


--
-- TOC entry 3247 (class 2606 OID 16739)
-- Name: Applications Applications_ApplicantId_SchemeId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Applications"
    ADD CONSTRAINT "Applications_ApplicantId_SchemeId_key" UNIQUE ("ApplicantId", "SchemeId");


--
-- TOC entry 3249 (class 2606 OID 16737)
-- Name: Applications Applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Applications"
    ADD CONSTRAINT "Applications_pkey" PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 16740)
-- Name: Applications Applications_ApplicantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Applications"
    ADD CONSTRAINT "Applications_ApplicantId_fkey" FOREIGN KEY ("ApplicantId") REFERENCES public."Applicants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3251 (class 2606 OID 16745)
-- Name: Applications Applications_SchemeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Applications"
    ADD CONSTRAINT "Applications_SchemeId_fkey" FOREIGN KEY ("SchemeId") REFERENCES public."Schemes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2024-09-10 06:13:23

--
-- PostgreSQL database dump complete
--

