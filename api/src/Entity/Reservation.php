<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\CreateProvider;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Random\RandomException;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    uriTemplate: '/showings/{showingId}/reservations',
    operations: [
        new Post(
            uriVariables: [
                'showingId' => new Link(toProperty: 'showing', fromClass: Showing::class),
            ],
            provider: CreateProvider::class,
        ),
    ],
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['write']]
)]
#[ORM\Entity]
class Reservation
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[Groups(['read', 'write'])]
    private ?int $id = null;

    /**
     * @var array<int[]>
     */
    #[ORM\Column(type: Types::JSON)]
    #[Assert\Type('array')]
    #[Assert\Count(min: 1)]
    #[Assert\All([
        new Assert\Count(exactly: 2),
        new Assert\Type('array'),
        new Assert\All([
            new Assert\Type('integer'),
            new Assert\GreaterThanOrEqual(0),
        ]),
    ])]
    #[Groups(['read', 'write'])]
    public ?array $seats = [];

    #[ORM\Column(type: Types::STRING)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Assert\Length(max: 255)]
    #[Groups(['read', 'write'])]
    public string $email = '';

    #[ORM\Column(type: Types::DECIMAL, precision: 6, scale: 2)]
    #[ApiProperty(readable: true, writable: false)]
    #[Groups(['read'])]
    public string $total = '';

    #[ORM\Column(type: Types::STRING)]
    #[ApiProperty(readable: true, writable: false)]
    #[Groups(['read'])]
    public string $token = '';

    #[ORM\ManyToOne(targetEntity: Showing::class, inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups(['read'])]
    public Showing $showing;

    #[Assert\IsFalse(message: 'The seats are already taken.')]
    #[Groups(['write'])]
    public function hasTakenSeats(): bool
    {
        $seats_taken = $this->showing->getSeatsTaken();

        foreach ($this->seats as $seat) {
            if (in_array($seat, $seats_taken)) {
                return true;
            }
        }

        return false;
    }

    #[Assert\IsTrue(message: 'The seats are invalid.')]
    #[Groups(['write'])]
    public function hasValidSeats(): bool
    {
        foreach ($this->seats as $seat) {
            if ($seat[0] > $this->showing->rows || $seat[1] > $this->showing->columns) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  array<int[]>  $seats
     *
     * @throws RandomException
     */
    public function setSeats(array $seats): self
    {
        $this->seats = $seats;
        $this->total = $this->total !== '' ? $this->total : number_format(count($this->seats) * 9, 2);
        $this->token = $this->token !== '' ? $this->token : bin2hex(random_bytes(16));

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}
