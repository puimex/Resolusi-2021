%Encoding the message
original=imread('cover.jpg');
cover=rgb2gray(original);
[row,column]=size(cover);
L=256;
stego=cover;

message=input('Enter the message to be hidden: ','s');
len=strlength(message)*8;  %Each character will take 8 bits so total number of bits in the message will be len
ascii=uint8(message);   %ascii is a vector having the ascii value of each character
binary_separate=dec2bin(ascii,8);   %binary_separate is an array having the decimal representation of each ascii value
binary_all='';  %binary_all will have the entire sequence of bits of the message
for i=1:strlength(message)
    binary_all=append(binary_all,binary_separate(i,:));
end

count=1;    %initializing count with 1

for i=1:row
    for j=1:column
        
        %for every character in the message
        if count<=len
            %Obtain the LSB of the grey level of the pixel
            LSB=mod(cover(i,j),2);
            
            %Convert the bit from the message to numeric form
            a=str2double(binary_all(count));

            %Perform XOR operation between the bit and the LSB
            temp=double(xor(LSB,a));
            
            %Change the bit of the stego image accordingly
            stego(i,j)=cover(i,j)+temp;
            
            count=count+1;
        end
    end
end

subplot(1,2,1);
imshow(cover);
title('Cover Image');

subplot(1,2,2);
imshow(stego);
title('Stego Image');

%Decoding the message
count=1;
message_in_bits='';
for i=1:row
    for j=1:column
        %For all the characters in the message
        if count<=len
            
            %Retrieve the LSB of the intensity level of the pixel
            LSB=mod(stego(i,j),2);
            
            %Append into message_in_bits to get bit sequence of message
            message_in_bits=append(message_in_bits,num2str(LSB));
            
            count=count+1;
        end
    end
end

%Converting the bit sequence into the original message
i=1;
original_message='';
while i<=len
    %Take a set of 8 bits at a time
    %Convert the set of bits to a decimal number
    %Convert the decimal number which is the ascii value to its corresponding character
    %Append the obtained character into the resultant string
    original_message=append(original_message,char(bin2dec(message_in_bits(1,i:i+7))));
    i=i+8;
end

disp(['The original message is: ',original_message]);
