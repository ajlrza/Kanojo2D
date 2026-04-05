class appManager:
      user = ""
      state = False

      def __init__(self, user, state):
          self.user = user
          self.state = True

      def startApp(self):
           if (self.state != True):
               # Sometimes the start app may be called without init
               return "Instance required, failed to start app"
           
           if (self.state == True):
                # This will start a while loop to initiate
                # A continuous chat event with Kurisu
                print("Initiliazing application...")
                self.state == True
                return self.state

      def stopApp(self):
           if (self.state == True):
                self.state = False
                return True
           
      def monitorApp(self, choice):
           if (choice == "User"):
                return self.user
           elif (choice == "State"):
                return self.state

           