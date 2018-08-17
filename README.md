# WebviewAPPWithGhostInspector
#First, we need to prepare a selenium grid, maybe we need to run the test cases on android mobile and iPhone.
#Second, go to the folder of the codes, run the below command in terminal.
npm install

#Third, change the wdio.config.js, especial the host and capabilities.

#Change the apikey, the suiteIDs(separate with ',') in the try.js file.

#Run the below command in terminal.
npm test

#After the test cases finished, run the below command in terminal.
allure generate .\allure-results\ --clean
#when then report is ready, run the below command in terminal.
allure open

#When run the testcases first time, there is not baseline screen shot, after that, there is baseline screen shot, maybe there is difference about the screen shot next times.
#we can manage the baseline screen shot on the folder screenshots\reference

