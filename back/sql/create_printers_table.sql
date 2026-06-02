CREATE TABLE IF NOT EXISTS `printers` (
  `i_id`       INT            NOT NULL AUTO_INCREMENT,
  `v_serial`   VARCHAR(50)    NOT NULL UNIQUE,
  `v_name`     VARCHAR(100)   NOT NULL,
  `v_model`    VARCHAR(50)    NOT NULL,
  `v_ip`       VARCHAR(45)    NOT NULL,
  `b_active`   TINYINT(1)     NOT NULL DEFAULT 1,
  PRIMARY KEY (`i_id`)
);

-- Insérer l'imprimante déjà connue
INSERT IGNORE INTO `printers` (`v_serial`, `v_name`, `v_model`, `v_ip`)
VALUES ('0309DA422200479', 'A3 - Ptite Question', 'A1 mini', '10.1.224.68');
