<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241127094802 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE movie_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE reservation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE showing_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE movie (id INT NOT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(512) NOT NULL, release_date DATE NOT NULL, rating NUMERIC(2, 1) NOT NULL, popularity INT NOT NULL, poster_path VARCHAR(255) NOT NULL, backdrop_path VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN movie.release_date IS \'(DC2Type:date_immutable)\'');
        $this->addSql('CREATE TABLE reservation (id INT NOT NULL, showing_id INT NOT NULL, seats JSON NOT NULL, email VARCHAR(255) NOT NULL, total NUMERIC(6, 2) NOT NULL, token VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_42C84955F436DC5 ON reservation (showing_id)');
        $this->addSql('CREATE TABLE showing (id INT NOT NULL, movie_id INT DEFAULT NULL, starts_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, rows INT NOT NULL, columns INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_266FA23B8F93B6FC ON showing (movie_id)');
        $this->addSql('COMMENT ON COLUMN showing.starts_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955F436DC5 FOREIGN KEY (showing_id) REFERENCES showing (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE showing ADD CONSTRAINT FK_266FA23B8F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE movie_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE reservation_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE showing_id_seq CASCADE');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955F436DC5');
        $this->addSql('ALTER TABLE showing DROP CONSTRAINT FK_266FA23B8F93B6FC');
        $this->addSql('DROP TABLE movie');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE showing');
    }
}
