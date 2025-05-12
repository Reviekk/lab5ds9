document.addEventListener('DOMContentLoaded', function() {
        // Validación personalizada para formulario de checkout
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
          checkoutForm.addEventListener('submit', function(event) {
            let valid = true;
            
            // Validar teléfono (8 dígitos para Panamá)
            const phoneInput = document.getElementById('phone');
            if (phoneInput && !/^\d{8}$/.test(phoneInput.value)) {
              valid = false;
              phoneInput.classList.add('is-invalid');
              
              // Crear mensaje de error si no existe
              if (!document.getElementById('phone-error')) {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'phone-error';
                errorDiv.className = 'invalid-feedback';
                errorDiv.textContent = 'Por favor, ingresa un número de 8 dígitos.';
                phoneInput.parentNode.appendChild(errorDiv);
              }
            } else if (phoneInput) {
              phoneInput.classList.remove('is-invalid');
            }
            
            // Validar email
            const emailInput = document.getElementById('email');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
              valid = false;
              emailInput.classList.add('is-invalid');
              
              // Crear mensaje de error si no existe
              if (!document.getElementById('email-error')) {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'email-error';
                errorDiv.className = 'invalid-feedback';
                errorDiv.textContent = 'Por favor, ingresa un email válido.';
                emailInput.parentNode.appendChild(errorDiv);
              }
            } else if (emailInput) {
              emailInput.classList.remove('is-invalid');
            }
            
            // Detener envío si hay errores
            if (!valid) {
              event.preventDefault();
            }
          });
        }
        
        // Actualización automática del carrito al cambiar cantidad
        const quantityInputs = document.querySelectorAll('.cart-quantity-input');
        if (quantityInputs.length > 0) {
          quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
              this.closest('form').submit();
            });
          });
        }
        
        // Confirmación antes de eliminar productos del carrito
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        if (removeButtons.length > 0) {
          removeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
              if (!confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
                event.preventDefault();
              }
            });
          });
        }
      });