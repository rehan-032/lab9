import React, { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import UserList from './components/UserList';

function App() {
  const [refreshUserList, setRefreshUserList] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow-lg">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center">
          University Management System
        </h1>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b border-indigo-300 pb-2">
            Register New User
          </h2>
          <RegisterForm onRegister={() => setRefreshUserList(!refreshUserList)} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b border-indigo-300 pb-2">
            Registered Users
          </h2>
          <UserList refreshTrigger={refreshUserList} />
        </section>
      </div>
    </div>
  );
}

export default App;
