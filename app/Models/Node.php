<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Node extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'predecessors',
        'successors'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        // Dates
        'isStartDateLocked' => 'boolean',
        'isEndDateLocked' => 'boolean',
        'isStartDateVisible' => 'boolean',
        'isDurationVisible' => 'boolean',
        'isEndDateVisible' => 'boolean',
        // Style
        'style' => 'json'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'mapId',
        'parentNode',
        'type',
        // Label
        'label',
        // Dates
        'startDate',
        'duration',
        'endDate',
        'isStartDateLocked',
        'isEndDateLocked',
        'isLabelVisible',
        'isStartDateVisible',
        'isDurationVisible',
        'isEndDateVisible',
        // Style
        'style',
        // React Flow Properties
        'expandParent',
        'positionX',
        'positionY',
        'zIndex'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    /**
     * Get the node's predecessors
     */
    protected function predecessors(): Attribute
    {
        return new Attribute(
            get: function() {
                $predecessors = Edge::where('source', $this->getKey())->pluck('target')->toArray();
                return $predecessors;
            }
        );
    }

    /**
     * Get the node's successors
     */
    protected function successors(): Attribute
    {
        return new Attribute(
            get: function() {
                $successors = Edge::where('target', $this->getKey())->pluck('source')->toArray();
                return $successors;
            }
        );
    }
}
