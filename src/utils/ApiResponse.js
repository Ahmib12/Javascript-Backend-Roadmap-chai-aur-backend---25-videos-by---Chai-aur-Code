class ApiResponse {
    constructor(statusCode, data, message = "success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;//  its not neccessary to add it, but based on server status code --> its good to get<400 for success; 
        this.errors = error;
    }
}