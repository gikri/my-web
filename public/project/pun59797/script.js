document.addEventListener('DOMContentLoaded', () => {
    console.log('Linktree clone loaded');
    
    // Add micro-animations or tracking logic if needed
    const buttons = document.querySelectorAll('.link-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Optional: Subtle hover sound or extra effect
        });
    });
});
