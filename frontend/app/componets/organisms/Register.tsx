interface registerProps {
  onClick: () => void;
}

export default function Register({ onClick }: registerProps) {
  return (
    <div>
      <h1>Registrate!</h1>
      <form onSubmit={onClick}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form> 
    </div>
  );
}
