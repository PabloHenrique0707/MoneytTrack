-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: moneytrack
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `compartilhamentos`
--

DROP TABLE IF EXISTS `compartilhamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compartilhamentos` (
  `id_comp` int(11) NOT NULL AUTO_INCREMENT,
  `data_inicio` date DEFAULT NULL,
  `codigo_convite` varchar(100) DEFAULT NULL,
  `tipo_acesso` enum('admin','leitor') DEFAULT NULL,
  `permissao_exclusao` tinyint(1) DEFAULT 0,
  `gerenciamento_membros` tinyint(1) DEFAULT 0,
  `visualizacao_apenas` tinyint(1) DEFAULT 1,
  `data_expiracao_acesso` date DEFAULT NULL,
  PRIMARY KEY (`id_comp`),
  UNIQUE KEY `codigo_convite` (`codigo_convite`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compartilhamentos`
--

LOCK TABLES `compartilhamentos` WRITE;
/*!40000 ALTER TABLE `compartilhamentos` DISABLE KEYS */;
INSERT INTO `compartilhamentos` VALUES (1,'2026-05-01','ABC123','admin',1,1,0,'2026-12-31'),(2,'2026-05-02','DEF456','leitor',0,0,1,'2026-11-30'),(3,'2026-05-03','GHI789','admin',1,0,0,'2026-10-31');
/*!40000 ALTER TABLE `compartilhamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contas`
--

DROP TABLE IF EXISTS `contas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contas` (
  `id_conta` int(11) NOT NULL AUTO_INCREMENT,
  `nome_banco` varchar(100) DEFAULT NULL,
  `saldo_atual` decimal(10,2) DEFAULT 0.00,
  `tipo_moeda` varchar(20) DEFAULT NULL,
  `tipo_conta` enum('corrente','poupança') DEFAULT NULL,
  `taxa_manutenção` decimal(10,2) DEFAULT NULL,
  `limite_cheque_especial` decimal(10,2) DEFAULT NULL,
  `taxa_rendimento_mensal` decimal(10,2) DEFAULT NULL,
  `data_aniversario_poupança` date DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_conta`),
  KEY `contas_ibfk_1` (`usuario_id`),
  CONSTRAINT `contas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contas`
--

LOCK TABLES `contas` WRITE;
/*!40000 ALTER TABLE `contas` DISABLE KEYS */;
INSERT INTO `contas` VALUES (6,'Nubank',1500.00,'BRL','corrente',10.00,500.00,NULL,NULL,13);
/*!40000 ALTER TABLE `contas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gastos_previstos`
--

DROP TABLE IF EXISTS `gastos_previstos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos_previstos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `valor` decimal(10,2) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `data_prevista` date DEFAULT NULL,
  `status_gasto` enum('pendente','pago','cancelado') DEFAULT 'pendente',
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_gastos_previstos_usuario` (`usuario_id`),
  CONSTRAINT `fk_gastos_previstos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gastos_previstos`
--

LOCK TABLES `gastos_previstos` WRITE;
/*!40000 ALTER TABLE `gastos_previstos` DISABLE KEYS */;
INSERT INTO `gastos_previstos` VALUES (3,300.00,'Internet','2026-06-15','cancelado',13);
/*!40000 ALTER TABLE `gastos_previstos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meios_pagamento`
--

DROP TABLE IF EXISTS `meios_pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meios_pagamento` (
  `id_meio` int(11) NOT NULL AUTO_INCREMENT,
  `instituicao_emissora` varchar(150) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `tipo_meio` enum('cartao','digital') DEFAULT NULL,
  `numero_final` varchar(4) DEFAULT NULL,
  `bandeira` varchar(50) DEFAULT NULL,
  `limite_credito` decimal(10,2) DEFAULT NULL,
  `dia_fechamento` int(11) DEFAULT NULL,
  `chave_principal` varchar(255) DEFAULT NULL,
  `tipo_chave` enum('cpf','email','telefone','aleatoria') DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_meio`),
  KEY `fk_meios_pagamento_usuario` (`usuario_id`),
  CONSTRAINT `fk_meios_pagamento_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meios_pagamento`
--

LOCK TABLES `meios_pagamento` WRITE;
/*!40000 ALTER TABLE `meios_pagamento` DISABLE KEYS */;
INSERT INTO `meios_pagamento` VALUES (3,'Caixa',1,'cartao','5678','Visa',3000.00,15,NULL,NULL,13);
/*!40000 ALTER TABLE `meios_pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacoes`
--

DROP TABLE IF EXISTS `notificacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacoes` (
  `id_notificacao` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) DEFAULT NULL,
  `mensagem` text DEFAULT NULL,
  `data_envio` datetime DEFAULT current_timestamp(),
  `lida` tinyint(1) DEFAULT 0,
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_notificacao`),
  KEY `fk_notificacoes_usuario` (`usuario_id`),
  CONSTRAINT `fk_notificacoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacoes`
--

LOCK TABLES `notificacoes` WRITE;
/*!40000 ALTER TABLE `notificacoes` DISABLE KEYS */;
INSERT INTO `notificacoes` VALUES (3,'Meta atingida','Você alcançou sua meta financeira.','2026-05-27 16:38:17',0,13);
/*!40000 ALTER TABLE `notificacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planejamento_financeiro`
--

DROP TABLE IF EXISTS `planejamento_financeiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planejamento_financeiro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `valor_meta` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `planejamento_financeiro_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planejamento_financeiro`
--

LOCK TABLES `planejamento_financeiro` WRITE;
/*!40000 ALTER TABLE `planejamento_financeiro` DISABLE KEYS */;
INSERT INTO `planejamento_financeiro` VALUES (4,'Carro novo',NULL,'2028-12-22',NULL,7,29000.00),(6,'Casa nova',NULL,'2030-02-25',NULL,7,360000.00);
/*!40000 ALTER TABLE `planejamento_financeiro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefones`
--

DROP TABLE IF EXISTS `telefones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ddd` varchar(3) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_telefones_usuario` (`id_usuario`),
  CONSTRAINT `fk_telefones_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefones`
--

LOCK TABLES `telefones` WRITE;
/*!40000 ALTER TABLE `telefones` DISABLE KEYS */;
INSERT INTO `telefones` VALUES (3,'21','977777777',13);
/*!40000 ALTER TABLE `telefones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transacao`
--

DROP TABLE IF EXISTS `transacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacao` (
  `id_transacao` int(11) NOT NULL AUTO_INCREMENT,
  `valor` decimal(10,2) NOT NULL,
  `data_hora` datetime DEFAULT current_timestamp(),
  `descricao` varchar(255) DEFAULT NULL,
  `metodo_pagamento` varchar(100) DEFAULT NULL,
  `tipo_transacao` enum('receita','despesa') DEFAULT NULL,
  `fonte_renda` varchar(100) DEFAULT NULL,
  `categoria_gasto` varchar(100) DEFAULT NULL,
  `grau_essencialidade` enum('essencial','importante','superfluo') DEFAULT NULL,
  `conta_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_transacao`),
  KEY `transacao_ibfk_1` (`conta_id`),
  CONSTRAINT `transacao_ibfk_1` FOREIGN KEY (`conta_id`) REFERENCES `contas` (`id_conta`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacao`
--

LOCK TABLES `transacao` WRITE;
/*!40000 ALTER TABLE `transacao` DISABLE KEYS */;
INSERT INTO `transacao` VALUES (1,1000.00,'2026-05-19 16:15:19','peças para o carro',NULL,'despesa',NULL,NULL,NULL,NULL,NULL),(2,10000.00,'2026-05-20 15:42:03','peças vendidas',NULL,'receita',NULL,'Salário',NULL,NULL,5),(3,5000.00,'2026-05-20 15:42:13','peças ',NULL,'despesa',NULL,'Transporte',NULL,NULL,5),(4,100.00,'2026-05-20 15:46:33','venda de cachaça',NULL,'receita',NULL,'Salário',NULL,NULL,7),(5,100.00,'2026-05-20 15:47:00','torrei no tigrinho',NULL,'despesa',NULL,'Outros',NULL,NULL,7),(6,2000.00,'2026-05-20 15:49:51','soltou a cartinha',NULL,'receita',NULL,'Salário',NULL,NULL,7),(10,350.00,'2026-05-20 21:14:34','Gasolina',NULL,'despesa',NULL,'Transporte',NULL,NULL,5),(11,70.00,'2026-05-21 17:18:38','uber',NULL,'despesa',NULL,'Transporte',NULL,NULL,5),(12,7000.00,'2026-05-21 17:19:04','Peças vendidas',NULL,'receita',NULL,'Salário',NULL,NULL,5),(13,200.00,'2026-05-21 17:32:47','Almoço',NULL,'despesa',NULL,'Alimentação',NULL,NULL,5),(16,200.00,'2026-05-21 17:45:36','Almoço',NULL,'despesa',NULL,'Alimentação',NULL,NULL,7),(18,7000.00,'2026-05-21 21:43:23','Palio 96',NULL,'receita',NULL,'Salário',NULL,NULL,10),(20,3500.00,'2026-05-21 21:45:51','Notebook',NULL,'despesa',NULL,'Lazer',NULL,NULL,10),(21,50000.00,'2026-05-21 22:36:09','CARRO',NULL,'receita',NULL,'Salário',NULL,NULL,7),(25,80.00,'2026-05-27 16:37:31','Lanche','Débito','despesa',NULL,'Alimentação','superfluo',6,NULL),(26,19000.00,'2026-05-28 12:02:17','Carro vendido',NULL,'receita',NULL,'Salário',NULL,NULL,7),(28,250.00,'2026-05-28 16:23:42','Almoço',NULL,'despesa',NULL,'Alimentação',NULL,NULL,7);
/*!40000 ALTER TABLE `transacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_compartilhamento`
--

DROP TABLE IF EXISTS `usuario_compartilhamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_compartilhamento` (
  `id_usuario` int(11) NOT NULL,
  `id_comp` int(11) NOT NULL,
  `tipo_acesso` enum('admin','leitor') DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`id_comp`),
  KEY `fk_compartilhamento` (`id_comp`),
  CONSTRAINT `fk_compartilhamento` FOREIGN KEY (`id_comp`) REFERENCES `compartilhamentos` (`id_comp`),
  CONSTRAINT `fk_usuario_comp` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_compartilhamento`
--

LOCK TABLES `usuario_compartilhamento` WRITE;
/*!40000 ALTER TABLE `usuario_compartilhamento` DISABLE KEYS */;
INSERT INTO `usuario_compartilhamento` VALUES (13,3,'admin');
/*!40000 ALTER TABLE `usuario_compartilhamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `telefones` varchar(20) DEFAULT NULL,
  `limite_gastos` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (5,'jurema ','juremadamira@gmail.com','jurema',NULL,0.00),(7,'Jubileu doido','Jubileudoido@gmail.com','jubileu',NULL,5000.00),(9,'Ana Cristina','anacristina@gmail.com','ana',NULL,0.00),(13,'Carlos Souza','carlos@gmail.com','789',NULL,0.00);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-28 17:03:38
