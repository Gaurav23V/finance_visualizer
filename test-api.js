// Simple API test script
const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing Finance Visualizer API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.success ? 'PASSED' : 'FAILED');
    console.log('   Status:', healthData.data?.status || 'unknown');
    console.log('   Database:', healthData.data?.database?.connected ? 'Connected' : 'Disconnected');
    console.log();

    // Test 2: Create Transaction
    console.log('2. Testing Create Transaction...');
    const newTransaction = {
      amount: 100.50,
      date: new Date().toISOString(),
      description: 'Test transaction'
    };
    
    const createResponse = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction)
    });
    
    const createData = await createResponse.json();
    console.log('✅ Create Transaction:', createData.success ? 'PASSED' : 'FAILED');
    
    if (createData.success) {
      const transactionId = createData.data._id;
      console.log('   Created ID:', transactionId);
      console.log('   Amount:', createData.data.amount);
      console.log();

      // Test 3: Get Single Transaction
      console.log('3. Testing Get Single Transaction...');
      const getResponse = await fetch(`${BASE_URL}/transactions/${transactionId}`);
      const getData = await getResponse.json();
      console.log('✅ Get Transaction:', getData.success ? 'PASSED' : 'FAILED');
      console.log();

      // Test 4: Update Transaction
      console.log('4. Testing Update Transaction...');
      const updateData = {
        amount: 150.75,
        description: 'Updated test transaction'
      };
      
      const updateResponse = await fetch(`${BASE_URL}/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      const updateResult = await updateResponse.json();
      console.log('✅ Update Transaction:', updateResult.success ? 'PASSED' : 'FAILED');
      console.log('   Updated Amount:', updateResult.data?.amount);
      console.log();

      // Test 5: Get All Transactions
      console.log('5. Testing Get All Transactions...');
      const listResponse = await fetch(`${BASE_URL}/transactions`);
      const listData = await listResponse.json();
      console.log('✅ Get All Transactions:', listData.success ? 'PASSED' : 'FAILED');
      console.log('   Total Found:', listData.data?.transactions?.length || 0);
      console.log();

      // Test 6: Delete Transaction
      console.log('6. Testing Delete Transaction...');
      const deleteResponse = await fetch(`${BASE_URL}/transactions/${transactionId}`, {
        method: 'DELETE'
      });
      
      const deleteResult = await deleteResponse.json();
      console.log('✅ Delete Transaction:', deleteResult.success ? 'PASSED' : 'FAILED');
      console.log();

      // Test 7: Verify Deletion
      console.log('7. Testing Get Deleted Transaction (should fail)...');
      const verifyResponse = await fetch(`${BASE_URL}/transactions/${transactionId}`);
      const verifyData = await verifyResponse.json();
      console.log('✅ Verify Deletion:', !verifyData.success ? 'PASSED' : 'FAILED');
      console.log();
    } else {
      console.log('   Error:', createData.error);
      console.log('   Details:', createData.details);
    }

    console.log('🎉 API Testing Complete!');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

// Run the test
testAPI(); 