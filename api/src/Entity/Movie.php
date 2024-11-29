<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;

#[ApiResource(
    operations: [
        new Get,
        new GetCollection,
    ],
    normalizationContext: ['groups' => ['read']],
    order: ['popularity' => 'DESC'],
    paginationItemsPerPage: 12,
)]
#[ORM\Entity]
class Movie
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[Groups('read')]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups('read')]
    public string $title = '';

    #[ORM\Column(length: 512)]
    #[Groups('read')]
    public string $description = '';

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d'])]
    #[Groups('read')]
    #[ApiProperty(
        jsonSchemaContext: [
            'type' => 'string',
            'format' => 'Y-m-d',
        ]
    )]
    public DateTimeImmutable $release_date;

    #[ORM\Column(type: Types::DECIMAL, precision: 2, scale: 1)]
    #[Groups('read')]
    public string $rating = '';

    #[ORM\Column(type: Types::INTEGER)]
    public int $popularity;

    #[ORM\Column]
    public string $poster_path = '';

    #[ORM\Column]
    public string $backdrop_path = '';

    /** @var Collection<int, Showing> */
    #[ORM\OneToMany(mappedBy: 'movie', targetEntity: Showing::class, cascade: ['remove'])]
    #[Link(toProperty: 'movie')]
    public Collection $showings;

    public function __construct()
    {
        $this->showings = new ArrayCollection;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    #[ApiProperty]
    #[Groups(['read'])]
    public string $poster_url = '';

    #[ApiProperty]
    #[Groups(['read'])]
    public string $backdrop_url = '';
}
