<?php

declare(strict_types=1);

namespace App\Doctrine\Orm\Extension;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Showing;
use DateTimeImmutable;
use Doctrine\ORM\QueryBuilder;

/**
 * Restrict Bookmark collection to current user.
 */
final readonly class ShowingQueryCollectionExtension implements QueryCollectionExtensionInterface
{
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        if (
            $resourceClass !== Showing::class
            || $operation->getName() !== '_api_/movies/{movieId}/showings_get_collection'
        ) {
            return;
        }

        $queryBuilder
            ->andWhere(\sprintf('%s.starts_at > :date', $queryBuilder->getRootAliases()[0]))
            ->setParameter('date', new DateTimeImmutable);
    }
}
