// import node modules
const AWS = require('aws-sdk')
const fs = require('fs')

// configure AWS SDK
AWS.config.region = process.env.REGION

// Set constants from environment variables
const file_path = process.env.INGESTION_DATA_FILE_PATH
const secure_ip_address_table = process.env.SECURE_IP_ADDRESS_TABLE
const servers_info_table = process.env.SERVERS_INFO_TABLE
const user_role_table = process.env.USER_ROLE_TABLE

// Create DynamoDocumentClient instance
const ddb = new AWS.DynamoDB.DocumentClient()

// Execute script
execute()

// writeDynammoDataAsync reads a JSON file where the input table name
// is the same as the filename (excluding the .json file extension)
// and asynchronously writes lines from the JSON file to the specified
// DynamoDB table.
async function writeDynamoDataAsync(table) {
  console.log('Ingesting data into table ' + table + '...')
  const path = file_path + '' + table + '.json'
  const rawdata = fs.readFileSync(path)
  const ingestData = JSON.parse(rawdata)
    
  try {
    await Promise.all(ingestData.map(element => {
      return ddb.put({
        TableName: table,
        Item: {
          ...element
        }
      }).promise()
    }))
    console.log('Successfully ingested data into table ' + table + '...')
  } catch (e) {
    console.log('Error ingesting data into table ' + table + ':', e)
    throw e
  }
}

// writeAllAsync is a wrapper that executes multiple writeDynamoDataAsync()
// functions concurrently and waits on their executions to complete or for
// at least one write to fail.  Failure of any write causes the process
// to exit with a non-zero exit code.
async function writeAllAsync() {
  try {
    let write1 = writeDynamoDataAsync(secure_ip_address_table)
    let write2 = writeDynamoDataAsync(servers_info_table)
    let write3 = writeDynamoDataAsync(user_role_table)
    await Promise.all([write1, write2, write3])
  } catch (e) {
    console.log('Data ingestion failed: ', e)
    process.exit(2)
  }
  console.log('Data ingestion succeeded')
  process.exit(0)
}

// execute is the entrypoint for the script.  It calls and
// waits on writeAllAsync()
function execute() {
  writeAllAsync().then()
}