FROM maven:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

RUN mvn package
# If you are building your code for production
# RUN npm install --only=production

# RUN mvn exec:java -Dexec.mainClass="com.salesbox.MathService.App"
