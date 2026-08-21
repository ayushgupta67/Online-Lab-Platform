
# ByteForge - Online Coding Lab Platform

## Overview

The Online Lab Platform is a web-based application designed to facilitate coding assignments and their automated evaluation in an educational environment. This platform bridges the gap between instructors and students by providing a comprehensive system for creating, submitting, and evaluating programming assignments.

### Key Features

- **User Role Management**:
    - Instructors can create, edit, and delete coding assignments
    - Students can view assignments, submit code, and receive feedback
- **Assignment Management System**:
    - Upload problem statements and test cases
    - Organize assignments by courses or topics
- **Code Submission System**:
    - Interactive interface for students to write and submit solutions
    - Support for multiple programming languages
- **Automated Evaluation Engine**:
    - Executes submitted code against predefined test cases
    - Generates instant feedback on code performance and correctness
- **Authentication**:
    - Secure login system for instructors and students
    - Role-based access control
- **Result Management**:
    - Reaults and codes are saves in database for later access.


## Technical Stack

- **Frontend**: React, Tailwind CSS, Daisy UI
- **Backend**: Node.js
- **Database**: MongoDB
- ** Compiler API ** : Jdoodle


## Requirements

- Node.js (v14.x or higher)
- npm (v6.x or higher)


## Installation

1. Clone the repository:

```bash
git clone https://github.com/Mayank471/Online-Lab-Platform.git
cd Online-Lab-Platform
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. Set up the database:

 - Add MongoDB API key to .env File


## Running the Application

1. Start the server:

```bash
npm start
```

2. For development mode with auto-reload:

```bash
npm run dev
```

3. The application will be available at:

```
http://localhost:5000
```


## Contributing

We welcome contributions to improve the Online Lab Platform! If you're interested in contributing, please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Improvements

We are actively working on enhancing the platform with:

- Support for more programming languages
- Advanced plagiarism detection
- Integration with learning management systems
- Real-time collaboration features
- Enhanced analytics and reporting


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



[^1]: https://github.com/Mayank471/Online-Lab-Platform
