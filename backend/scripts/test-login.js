const testLogin = async () => {
    try {
        console.log('\n🧪 Probando login con fetch directamente...\n');
        
        const credentials = {
            email: 'daxkenyi001@gmail.com',
            password: '12345678'
        };
        
        console.log('📤 Enviando credenciales:', credentials);
        
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        console.log('📥 Status recibido:', response.status);
        
        const data = await response.json();
        console.log('📥 Respuesta completa:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('\n✅ Login exitoso!');
            console.log('   Token:', data.data.token.substring(0, 20) + '...');
            console.log('   Usuario:', data.data.user.email);
            console.log('   Rol:', data.data.user.role);
        } else {
            console.log('\n❌ Login falló');
            console.log('   Mensaje:', data.error?.message || data.message);
        }
        
    } catch (error) {
        console.error('\n❌ Error en la prueba:', error.message);
    }
};

testLogin();
