# Codex Agent Instructions

This file defines the expectations and behavioral constraints for Codex when generating code for this repository.

## General Behavior

- Always get latest with a `git pull` if working on an existing branch.
- **Do not comment code unless explicitly asked.**
- Use **descriptive and intention-revealing names**—avoid redundant comments.
- Prioritize **readability** and **maintainability** over brevity.
- Never add **binary files** (e.g. `.exe`, `.dll`, `.bin`, `.jpg`, `.png`, `.pdf`) to the repository.
- Avoid packages and modules that have licensing that requires attribution or money and/or commercial licensing.

## PR Guidelines

- Prefer to add screenshot to PR Description if possible.

## Development Guidelines

- Always follow the **SOLID principles**:

  - **S**ingle Responsibility
  - **O**pen/Closed
  - **L**iskov Substitution
  - **I**nterface Segregation
  - **D**ependency Inversion

- Apply **TDD (Test-Driven Development)** for all **business logic**:

  - Write the failing test first.
  - Implement just enough code to pass the test.
  - Refactor with tests passing.

- Prefer **Clean Code** always.
- Follow advice from **The Pragmatic Programmer**.
- Adhere to the **DRY (Don't Repeat Yourself)** and **KISS (Keep It Simple, Stupid)** principles.
- Always install dependencies via command line, i.e. `npm install <dependency>`
- Always install dependencies before committing the code. We don't want the package-lock.json to get out of date.
- Prefer **Vertical Slicing**, grouping feature-specific files within a feature folder when possible.

## Formatting and Structure

- Follow the project's `.editorconfig` and `lint` settings without exception.
- Prefer composition over inheritance unless there's a compelling reason.
- All code must be placed within its appropriate domain (e.g. `services`, `models`, `controllers`, etc.).
- Use consistent casing and naming conventions (e.g., camelCase for variables, PascalCase for types/classes).

## Prohibited Actions

- No auto-generated documentation.
- No adding, updating, or committing dependency lock files unless explicitly instructed.
- Never insert test credentials, API keys, or secrets into code.

## Pull Request Etiquette

- All commits should be atomic and meaningful.
- Every PR must include corresponding tests.
- If asked to generate a PR, include a **summary of changes** and why the change was made.

## C# Specific Guidelines

- Prefer composition over inheritance when possible.
- For services, use interfaces for enabling mocking in tests.
- Separate Unit & Integration Tests into separate folders within the Tests project.
- Don't reuse state or contexts between tests, all tests should be isolated and run individually or collectively and give the same result.
- Prefer interfaces defined at the top of implementation files
  Ex:

  ```c#
  public interface IDoSomething
  {
    void DoSomething()
  }

  public class DoSomething : IDoSomething
  {
    public void DoSomething()
    {
      // do something
    }
  }
  ```

## ASP.NET API Structure

- Prefer dependency injection.
- Group services together in an extension method.
- Prefer minimal API, with endpoints defined in extension method.
- Basic Folder Structure:

```
OnParDev.Mcp.Api/
+-Config
  +-Endpoints.cs # contains endpoints using Minimal API via extension methods
  +-Services.cs # contains addition of services via IServiceCollection extension methods
+-ClientApp/ # holds the React App frontend.
```

## Architecture Examples

### C# Minimal API Example

```csharp
public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/users", GetUsers);
    }

    private static async Task<IResult> GetUsers(IUserService service)
    {
        var users = await service.ListAsync();
        return Results.Ok(users);
    }
}
```

```csharp
public static class Services
{
    public static void AddApiServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
    }
}
```

### TypeScript React Fetch Example

```tsx
export interface User {
  id: number;
  name: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/users");
      const data: User[] = await res.json();
      setUsers(data);
    }
    load();
  }, []);

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

## Coding Standards - Level 100
- No duplication (including tests)
- Ticket # in commit message
- No commented out code
- Methods have 10 or fewer lines - Including test methods
- Methods have 3 or fewer parameters
- Classes have 7 or fewer public members (Single Responsibility)
- No method calls or logic in constructors
- No checked exceptions (Java)
- Classes are named using a noun or noun phrase
- Methods are named using a verb or verb phrase
- Variable and field names are pronounceable
- Only 1 level of inheritance

## Unit Test Standards - Level 100
- No assertNotNull()
- No @Ignore tests
- 3 or fewer assertions per test method
- No mocked static methods

## Coding Standards - Level 200
- Only inherit from abstract or interfaces
- No name decorations (FooImpl.java)
- No getter/setters on Interfaces
- No constant interfaces
- No public constants
- Query methods don't throw exceptions
- Query methods don't change state
- Command methods change state
- Command methods throw expections when state is unable to be changed
- Factory methods over constructors

## Unit Test Standards - Level 200
- Arrange, Act, Assert
- No uncovered lines
- Prefer state based testing: Prefer stubs over mocks

