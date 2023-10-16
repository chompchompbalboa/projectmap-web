<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Map extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * Default attribute values
     *
     * @var array
     */
    protected $attributes = [
        'name' => 'Untitled'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'userId',
        'name'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'nodes',
        'edges',
        'created_at',
        'updated_at'
    ];

    /**
     * Get the map's nodes
     */
    public function nodes(): HasMany
    {
        return $this->hasMany(Node::class, 'mapId');
    }

    /**
     * Get the map's edges
     */
    public function edges(): HasMany
    {
        return $this->hasMany(Edge::class, 'mapId');
    }
}
