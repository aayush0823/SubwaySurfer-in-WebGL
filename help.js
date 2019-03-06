function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function modulus(x){
	if(x<0)
		x*=-1;
	return x;
}