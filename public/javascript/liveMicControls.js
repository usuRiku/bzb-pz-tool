document.addEventListener('DOMContentLoaded', () => {
  const btnReverseNumbers = document.getElementById('reverseNumbers');
  const btnReverseParts = document.getElementById('reverseParts');

  function reverseInputs(selector){
    const inputs = Array.from(document.querySelectorAll(selector));
    if(inputs.length === 0) return;
    const vals = inputs.map(i => i.value);
    vals.reverse();
    inputs.forEach((input, idx) => input.value = vals[idx] !== undefined ? vals[idx] : '');
  }

  if(btnReverseNumbers){
    btnReverseNumbers.addEventListener('click', (e) =>{
      e.preventDefault();
      reverseInputs('.stage-area input[name="live[micNumber][]"]');
    });
  }

  if(btnReverseParts){
    btnReverseParts.addEventListener('click', (e) =>{
      e.preventDefault();
      reverseInputs('.stage-area input[name="live[micPart][]"]');
    });
  }
});
