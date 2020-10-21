const AWS = require('aws-sdk')
const fs = require('fs')
AWS.config.region = 'us-west-2'
const ddb = new AWS.DynamoDB.DocumentClient()

const credit_secure_ip_address_table = 'credit-secure-ip-address-dev'
const credit_servers_info_dev_table = 'credit-servers-info-dev'
const credit_user_role_dev_table = 'credit-user-role-dev'

execute()

async function writeDynamoDataAsync(table) {
  console.log('Ingesting data into table ' + table + '...')
  const path = table + '.json'
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

async function writeAllAsync() {
  try {
    let write1 = writeDynamoDataAsync(credit_secure_ip_address_table)
    let write2 = writeDynamoDataAsync(credit_servers_info_dev_table)
    let write3 = writeDynamoDataAsync(credit_user_role_dev_table)
    await Promise.all([write1, write2, write3])
  } catch (e) {
    console.log('Data ingestion failed: ', e)
    process.exit(2)
  }
  console.log('Data ingestion succeeded')
  process.exit(0)
}

function execute() {
  writeAllAsync().then()
}