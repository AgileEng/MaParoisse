
package eu.agileeng.ws.operator;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SendFile complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="SendFile">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="boxId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="serviceId" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="virtualBoxId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="docId" type="{http://www.w3.org/2001/XMLSchema}long"/>
 *         &lt;element name="rawScan" type="{http://www.w3.org/2001/XMLSchema}base64Binary" minOccurs="0"/>
 *         &lt;element name="rawFileExtension" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="improvedScan" type="{http://www.w3.org/2001/XMLSchema}base64Binary" minOccurs="0"/>
 *         &lt;element name="improvedFileExtension" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="text" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "SendFile", propOrder = {
    "boxId",
    "serviceId",
    "virtualBoxId",
    "docId",
    "rawScan",
    "rawFileExtension",
    "improvedScan",
    "improvedFileExtension",
    "text"
})
public class SendFile {

    protected String boxId;
    protected int serviceId;
    protected String virtualBoxId;
    protected long docId;
    protected byte[] rawScan;
    protected String rawFileExtension;
    protected byte[] improvedScan;
    protected String improvedFileExtension;
    protected String text;

    /**
     * Gets the value of the boxId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBoxId() {
        return boxId;
    }

    /**
     * Sets the value of the boxId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBoxId(String value) {
        this.boxId = value;
    }

    /**
     * Gets the value of the serviceId property.
     * 
     */
    public int getServiceId() {
        return serviceId;
    }

    /**
     * Sets the value of the serviceId property.
     * 
     */
    public void setServiceId(int value) {
        this.serviceId = value;
    }

    /**
     * Gets the value of the virtualBoxId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getVirtualBoxId() {
        return virtualBoxId;
    }

    /**
     * Sets the value of the virtualBoxId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setVirtualBoxId(String value) {
        this.virtualBoxId = value;
    }

    /**
     * Gets the value of the docId property.
     * 
     */
    public long getDocId() {
        return docId;
    }

    /**
     * Sets the value of the docId property.
     * 
     */
    public void setDocId(long value) {
        this.docId = value;
    }

    /**
     * Gets the value of the rawScan property.
     * 
     * @return
     *     possible object is
     *     byte[]
     */
    public byte[] getRawScan() {
        return rawScan;
    }

    /**
     * Sets the value of the rawScan property.
     * 
     * @param value
     *     allowed object is
     *     byte[]
     */
    public void setRawScan(byte[] value) {
        this.rawScan = ((byte[]) value);
    }

    /**
     * Gets the value of the rawFileExtension property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRawFileExtension() {
        return rawFileExtension;
    }

    /**
     * Sets the value of the rawFileExtension property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRawFileExtension(String value) {
        this.rawFileExtension = value;
    }

    /**
     * Gets the value of the improvedScan property.
     * 
     * @return
     *     possible object is
     *     byte[]
     */
    public byte[] getImprovedScan() {
        return improvedScan;
    }

    /**
     * Sets the value of the improvedScan property.
     * 
     * @param value
     *     allowed object is
     *     byte[]
     */
    public void setImprovedScan(byte[] value) {
        this.improvedScan = ((byte[]) value);
    }

    /**
     * Gets the value of the improvedFileExtension property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getImprovedFileExtension() {
        return improvedFileExtension;
    }

    /**
     * Sets the value of the improvedFileExtension property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setImprovedFileExtension(String value) {
        this.improvedFileExtension = value;
    }

    /**
     * Gets the value of the text property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getText() {
        return text;
    }

    /**
     * Sets the value of the text property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setText(String value) {
        this.text = value;
    }

}
