
/*
CREATE TABLE tb_usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE tb_tareas (
    id_tarea INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    description VARCHAR(255) NOT NULL,
    date DATETIME DEFAULT GETDATE(),
    id_usuario INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_id_usuarios FOREIGN KEY (id_usuario) REFERENCES tb_usuarios(id_usuario) ON DELETE CASCADE
)
*/

SELECT * FROM tb_usuarios;