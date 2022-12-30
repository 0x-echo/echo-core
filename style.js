export default function(options) {
  return `
  #echo-core-message {
    position: fixed;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 12px;
    background: white;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, .12);
    font-weight: 600;
    display: none;
  }
  
  #echo-core-message.echo-error {
    color: #FF4838;
  }
  
  #echo-core-message.echo-success {
    color: #83BF1C;
  }
  
  #echo-loading {
    display: none;
    position: fixed;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 12px;
    background: white;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, .12);
  }
  
  .echo-loading__loader {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #4E75F6;
    clip-path: inset(0 0 50% 0);
    transform: rotate(0);
    animation: spin .6s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  `
}
