/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table UserForm
# ------------------------------------------------------------

DROP TABLE IF EXISTS `UserForm`;

CREATE TABLE `UserForm` (
  `uuid` binary(16) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `type` enum('schema','template') NOT NULL DEFAULT 'schema',
  `@contents` longtext,
  `sortIndex` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `UserForm` (`uuid`, `title`, `type`, `@contents`, `sortIndex`)
VALUES
  (UNHEX(REPLACE(UUID(), '-', '')), '::Users', 'schema', '{"formSchema":[{"type":"section","htmlClass":"row","items":[{"type":"section","htmlClass":"col-sm-6","items":["username"]},{"type":"section","htmlClass":"col-sm-6","items":["password"]}]},{"type":"section","htmlClass":"row","items":[{"type":"section","htmlClass":"col-sm-6","items":["first_name"]},{"type":"section","htmlClass":"col-sm-6","items":["last_name"]}]},{"type":"section","htmlClass":"row","items":[{"type":"section","htmlClass":"col-sm-6","items":[{"key":"middle_names","items":[{"key":"middle_names[]","notitle":true}]}]},{"type":"section","htmlClass":"col-sm-6","items":[{"key":"birthday","format":"yyyy-mm-dd"}]}]},{"key":"groups","items":[{"key":"groups[]","notitle":true}]},{"key":"forms","items":[{"key":"forms[]","notitle":true}]},{"type":"template","template":"<div class=\'form-group text-right\'>Last Updated: {{model.timestamp | date}}<\\/div>","condition":"model.uuid"}],"module":"User","description":"System users","searchSchema":[{"type":"section","htmlClass":"row","items":[{"type":"section","htmlClass":"col-lg-3 col-sm-4","items":[{"key":"filter.name","type":"search","fieldAddonRight":"<i class=\'glyphicon glyphicon-search\'><\\/i>","placeholder":"Type to search ...","feedback":false,"disableSuccessState":true,"disableErrorState":true}]},{"type":"section","htmlClass":"col-lg-9 col-sm-8","items":[]}]}]}', 254),
  (UNHEX(REPLACE(UUID(), '-', '')), '::User Forms', 'schema', '{"description":"Back End User Forms","formSchema":[{"key":"uuid","type":"label","condition":"model.uuid"},"title",{"key":"description","type":"textarea"},"sortIndex",{"key":"type","titleMap":{"schema":"Schema","template":"Template","templateUrl":"Template URL"}},"module",{"key":"template","condition":"model.type == \'template\'","type":"ace","aceOptions":{"useWrapMode":true,"showGutter":true,"useSoftTabs":true,"mode":"html","advanced":{"tabSize":2}}},{"key":"templateUrl","condition":"model.type == \'templateUrl\'"},{"key":"searchSchemaJson","title":"Search Schema","condition":"model.type == \'schema\'","type":"ace","aceOptions":{"useWrapMode":true,"showGutter":true,"useSoftTabs":true,"mode":"json","advanced":{"tabSize":2}}},{"key":"formSchemaJson","title":"Form Schema","condition":"model.type == \'schema\'","type":"ace","aceOptions":{"useWrapMode":true,"showGutter":true,"useSoftTabs":true,"mode":"json","advanced":{"tabSize":2}}},{"type":"template","template":"<div class=\'form-group text-right\'>Last Update: {{model.timestamp}}<\\/div>","condition":"model.uuid"}],"module":"UserForm","searchSchema":[{"type":"section","htmlClass":"row","items":[{"type":"section","htmlClass":"col-lg-3 col-sm-4","items":[{"key":"filter.$","type":"text","fieldAddonRight":"<i class=\'glyphicon glyphicon-search\'><\\/i>","placeholder":"Type to search ...","feedback":false,"disableSuccessState":true,"disableErrorState":true}]},{"type":"section","htmlClass":"col-lg-9 col-sm-8","items":[]}]}]}', 255);



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
