<?php

namespace App\Http\Controllers;

use App\Models\Edge;
use App\Models\Node;
use Illuminate\Http\Request;

class NodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $newNode = Node::create($request->all());
        return $newNode;
    }

    /**
     * Display the specified resource.
     */
    public function show(Node $node)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Node $node)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Node $node)
    {
        return $node->fill($request->all())->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Node $node)
    {
        // Destroy any edges connected to the node
        Edge::where('source', $node->id)->delete();
        Edge::where('target', $node->id)->delete();
        // Destroy the node
        return Node::destroy($node->id);
    }
}
