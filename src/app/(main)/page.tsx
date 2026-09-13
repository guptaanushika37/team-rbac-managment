import Link from "next/link";
import React from "react";

const Home = async () => {
    const user=false;
  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Team Access Control Demo</h1>
        <p className="text-slate-300 mb-8">
            This demo showcases nextjs access control feature with role based permission
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
                <h3 className="font-semibold mb-3 text-white">
                    Feawtures demonstrated
                </h3>
                <ul className="List-disc list-inside space-y-1 text-sm text-slate-300">
                    <li>Role based access control(rbac)</li>
                    <li>Route protection with middleware</li>
                    <li>Server side permission check</li>
                    <li>Client side permission hooks</li>
                    <li>Dynamic Route access</li>
                </ul>
            </div>
            <div className="bg-slate-800 p-6 border-slate-700 rounded-lg">

                 <h3 className="font-semibold mb-3 text-white">
                    User Roles
                </h3>
                <ul className=" space-y-1 text-sm text-slate-300">
                    <li><strong className="text-purple-400">Super Admin </strong>Full System Access</li>
                    <li><strong className="text-green-400">Admin </strong>User & Team Managment</li>
                    <li><strong className="text-blue-400">Manager </strong>Team-Specific managment</li>
                    <li><strong className="text-yellow-400">User </strong>Basic Dashboard Access</li>
                  
                </ul>

            </div>


        </div>


      {user? <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 ">
      <p className="text-green-300">
        Welcome Back, <strong>Akash
        </strong>! You are logged in as {" "}<strong className="text-green-200">ADMIN</strong>

      </p>
      <Link href="/dashboard" className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Go to Dashboard</Link>
      
      </div>  :<div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 ">

      <p className="text-slate-300 mb-3">
        You are logged in as {" "}<strong className="text-green-200">ADMIN</strong>

      </p>

       <Link href="/login" className=" px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Login</Link>
       <Link href="/register" className="ml-3 px-4 py-2 bg-slate-600 text-white rounded hover:bg-blue-700 transition-colors">Register</Link>

      

      
      </div> }
    </div>
  );
};

export default Home;