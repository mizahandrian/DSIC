<?php

namespace App\Http\Controllers;

use App\Models\BaseRohi;
use Illuminate\Http\Request;

class BaseRohiController extends Controller
{
    public function index()
    {
        return BaseRohi::all();
    }

    public function store(Request $request)
    {
        return BaseRohi::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $rohi = BaseRohi::findOrFail($id);
        $rohi->update($request->all());
        return $rohi;
    }

    public function destroy($id)
    {
        BaseRohi::destroy($id);
        return ['message' => 'supprimé'];
    }
}