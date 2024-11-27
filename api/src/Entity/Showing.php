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
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;

#[ApiResource(
    uriTemplate: '/movies/{movieId}/showings',
    operations: [
        new GetCollection(
            paginationEnabled: false
        ),
    ],
    uriVariables: [
        'movieId' => new Link(toProperty: 'movie', fromClass: Movie::class),
    ],
    normalizationContext: ['groups' => ['showing:list']],
)]
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/showings/{id}',
        ),
    ],
    uriVariables: [
        'id' => new Link(fromClass: Showing::class),
    ],
    normalizationContext: ['groups' => ['showing:show']],
)]
#[ORM\Entity]
class Showing
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[Groups(['showing:list', 'showing:show'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Groups(['showing:list', 'showing:show'])]
    public DateTimeImmutable $starts_at;

    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['showing:show'])]
    public int $rows;

    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['showing:show'])]
    public int $columns;

    #[ORM\ManyToOne(targetEntity: Movie::class, inversedBy: 'showings')]
    public ?Movie $movie = null;

    /** @var Collection<int, Reservation> */
    #[ORM\OneToMany(mappedBy: 'showing', targetEntity: Reservation::class)]
    public Collection $reservations;

    public function __construct()
    {
        $this->reservations = new ArrayCollection;
    }

    /**
     * @return array<int[]>
     */
    #[ApiProperty(
        jsonSchemaContext: [
            'type' => 'array',
            'items' => [
                'type' => 'array',
                'items' => [
                    'type' => 'integer',
                ],
            ],
        ]
    )]
    #[Groups(['showing:show'])]
    #[SerializedName('seats_taken')]
    public function getSeatsTaken(): array
    {
        $seats_taken = $this->reservations->map(fn (Reservation $reservation) => $reservation->seats);

        return array_merge(...$seats_taken);
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}
