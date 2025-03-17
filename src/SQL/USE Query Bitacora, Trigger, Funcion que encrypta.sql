USE db_app_tareas
GO
/*
-- CREACION DE LA BITACORA

CREATE TABLE tb_bitacora (
    id_bitacora INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    operacion VARCHAR(10) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT GETDATE()
);
*/
/*
-- CREACION DEL TRIGGER PARA REGISTRAR INSERCIONES
CREATE TRIGGER trg_InsertarUsuarioBitacora
ON tb_usuarios
AFTER INSERT
AS
BEGIN
    INSERT INTO tb_bitacora (id_usuario, username, email, operacion, fecha)
    SELECT id_usuario, username, email, 'INSERT', GETDATE()
    FROM inserted;
END
*/

/*
-- VERIFICAR SI SE CREO CORRECTAMENTE EL TRIGGER

SELECT name AS TriggerName FROM sys.triggers WHERE name = 'trg_InsertarUsuarioBitacora'
*/

/*
-- CREACION DE LA FUNCION PARA PROTEGER LA CONTRASEÑA ( HASH )
CREATE FUNCTION protect(@valor VARCHAR(max))
RETURNS VARBINARY(8000)
AS 
BEGIN
    DECLARE @clave VARBINARY(8000)
    SET @clave = ENCRYPTBYPASSPHRASE('daved', @valor)
RETURN @clave
END
*/

/*
-- VERIFICAR SI SE CREO LA FUNCION CORRECTAMENTE

SELECT 
    name AS FunctionName,
    type_desc AS ObjectType
FROM 
    sys.objects
WHERE 
    type_desc = 'SQL_SCALAR_FUNCTION'
    AND name = 'protect'
*/

/*

-- CREACION DE FUNCION DE DESENCRIPTAR

CREATE FUNCTION desprotect(@val varbinary(8000))
RETURNS VARCHAR(max)
AS
BEGIN
    DECLARE @dat VARCHAR(MAX)
    SET @dat = DECRYPTBYPASSPHRASE('daved', @val)
RETURN @dat
END
*/

/*

-- VERIFICAR SI LA FUNCION SE CREO CORRECTAMENTE
SELECT name AS FunctionName, type_desc AS ObjectType
FROM
    sys.objects
WHERE 
    type_desc = 'SQL_SCALAR_FUNCTION'
    AND name = 'desprotect'
*/

/*
-- ARREGLO DE ERRORES EN LA CONTRASEÑA
ALTER FUNCTION desprotect(@val VARCHAR(MAX)) 
RETURNS VARCHAR(MAX)
AS
BEGIN
    DECLARE @dat VARCHAR(MAX)
    SET @dat = CONVERT(VARCHAR(MAX), DECRYPTBYPASSPHRASE('daved', CONVERT(VARBINARY(8000), @val)))
    RETURN @dat
END


-- COMPORIBAMOS INGRESANDO UN USUARIO
INSERT INTO tb_usuarios (username, email, password)
VALUES ('alan', 'alan@gmail.com', dbo.protect('alan123456'));


--COMPROBAMOS ( LA CONTRASEÑA NO SE PUEDE VER )
SELECT * FROM tb_usuarios;

-- USAMOS LA FUNCION PARA DESENCRIPTAR LAS CONTRASEÑAS Y PODER VERLAS
SELECT username, email, dbo.desprotect(password) AS decrypted_password
FROM tb_usuarios;



*/
SELECT * FROM tb_usuarios
