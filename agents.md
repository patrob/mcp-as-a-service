# Codex Agent Instructions

This file defines the expectations and behavioral constraints for Codex when generating code for this repository.

## General Behavior

- **Do not comment code unless explicitly asked.**
- Use **descriptive and intention-revealing names**—avoid redundant comments.
- Prioritize **readability** and **maintainability** over brevity.
- Never add **binary files** (e.g. `.exe`, `.dll`, `.bin`, `.jpg`, `.png`, `.pdf`) to the repository.

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

- Adhere to the **DRY (Don't Repeat Yourself)** and **KISS (Keep It Simple, Stupid)** principles.
- Always install dependencies via command line, i.e. `npm install <dependency>`
- Always install dependencies before committing the code. We don't want the package-lock.json to get out of date.

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

