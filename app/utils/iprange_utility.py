import ipaddress


class IpRangeUtility:
    def __init__(self, cidr: str):
        """
        Initializes a new instance of the IpRangeUtility class with the specified CIDR notation.

        :param cidr: The CIDR notation (e.g., "1.1.1.0/24").
        :raises ValueError: If the CIDR format is null, invalid, or the prefix length is out of range.
        """
        if not cidr or not cidr.strip():
            raise ValueError("CIDR format is null or invalid.")

        parts = cidr.split('/')
        if len(parts) != 2:
            raise ValueError("Invalid CIDR format. Expected format: 'IP/Prefix'.")

        self.base_ip = parts[0]
        try:
            ip = ipaddress.IPv4Address(self.base_ip)
        except ipaddress.AddressValueError:
            raise ValueError("Invalid IP address format.")

        try:
            prefix_length = int(parts[1])
        except ValueError:
            raise ValueError("Invalid prefix length.")

        if prefix_length < 0 or prefix_length > 32:
            raise ValueError("Prefix length must be between 0 and 32.")

        self.prefix_length = prefix_length

        # Convert the IP address to a 32-bit integer.
        ip_int = int(ip)
        # Calculate the network mask based on the prefix length.
        mask = (0xFFFFFFFF << (32 - self.prefix_length)) & 0xFFFFFFFF if self.prefix_length != 0 else 0
        # Determine the starting IP address in the range.
        self.start_ip = ip_int & mask
        # Determine the ending IP address in the range.
        self.end_ip = self.start_ip | (~mask & 0xFFFFFFFF)
        # Calculate the total number of IP addresses in the range.
        self.number_of_ips = (self.end_ip - self.start_ip) + 1

    @staticmethod
    def is_valid_ip(ip: str) -> bool:
        """
        Validates whether the provided string is a valid IPv4 address.

        :param ip: The IP address string to validate.
        :return: True if the IP address is valid; otherwise, False.
        """
        try:
            ipaddress.IPv4Address(ip)
            return True
        except ipaddress.AddressValueError:
            return False

    def is_ip_in_range(self, ip: str) -> bool:
        """
        Determines whether a specific IP address is within the defined range.

        :param ip: The IP address to check.
        :return: True if the IP address is within the range; otherwise, False.
        """
        if not self.is_valid_ip(ip):
            return False
        ip_int = int(ipaddress.IPv4Address(ip))
        return self.start_ip <= ip_int <= self.end_ip

    def get_all_ips(self) -> list:
        """
        Generates a list of all IP addresses within the defined range.
        This method skips the first two IP addresses (similar to the C# example).

        :return: A list of IP address strings.
        :raises Exception: If the IP range is too large to generate.
        """
        # Prevent generating extremely large lists
        if self.number_of_ips > 1000000:
            raise Exception("The IP range is too large to generate.")

        ips = []
        # Generate IP addresses from start_ip + 2 to end_ip (inclusive)
        for ip_int in range(self.start_ip + 2, self.end_ip + 1):
            ips.append(str(ipaddress.IPv4Address(ip_int)))
        return ips


# Example usage:
# if __name__ == "__main__":
#     cidr_input = "11.0.0.0/19"
#     ip_util = IpRangeUtility(cidr_input)
#     print("Base IP:", ip_util.base_ip)
#     print("Prefix Length:", ip_util.prefix_length)
#     print("Start IP:", str(ipaddress.IPv4Address(ip_util.start_ip)))
#     print("End IP:", str(ipaddress.IPv4Address(ip_util.end_ip)))
#     print("Number of IPs:", ip_util.number_of_ips)
#
#     # Check if a specific IP is within the range
#     test_ip = "192.168.1.10"
#     print(f"Is {test_ip} in range? {ip_util.is_ip_in_range(test_ip)}")
#
#     # Generate list of IPs (this example generates a manageable list of IP addresses)
#     all_ips = ip_util.get_all_ips()
#     print("Total generated IPs:", len(all_ips))
#     for ip in all_ips:
#         print(ip)