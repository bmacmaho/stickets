#!/usr/bin/env python3

def string_to_bytearray_repr(s):
    s_bytes = s.encode('ascii')
    # Break into 31-byte chunks (field252 constraint)
    chunks = []
    for i in range(0, len(s_bytes), 31):
        chunk = s_bytes[i:i+31]
        # Convert chunk to a single large integer
        value = int.from_bytes(chunk, byteorder='big')
        chunks.append(value)
    # Construct the representation
    # Format: "number_of_chunks-1 chunk1 chunk2 ... chunkN string_length"
    result = [str(len(chunks) - 1)] + [str(chunk) for chunk in chunks] + [str(len(s))]
    return " ".join(result)

# Example usage and testing
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        input_string = sys.argv[1]
        #print(f"Input: {input_string}")
        #print(f"ByteArray Representation: {string_to_bytearray_repr(input_string)}")
        print(f'{string_to_bytearray_repr(input_string)}')
    else:
        print("Please provide a string argument")
