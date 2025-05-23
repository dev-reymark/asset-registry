<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Handle a login request.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();

            $user = Auth::user();
            $user->load('employee');
            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'role' => $user->user_role,
                    'employee_id' => $user->employee ? $user->employee->EMPNO : null, // safe access
                ]
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    /**
     * Logout the authenticated user.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
